import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  validateRequest,
} from '@rjmicrotix/common';
import express, { Request, Response } from 'express';
import { header } from 'express-validator';
import { Order } from '../models/Order';

import { webhookCheckout } from '../middlewares/webhook-checkout';
import { Payment } from '../models/Payment';
import { PaymentCompletePublisher } from '../events/publishers/payment-complete-publisher';
import { natsWrapper } from '../nats-wrapper';
import { stripe } from '../stripe-config';

const router = express.Router();

router.post(
  '/api/payments',
  [header('stripe-signature').notEmpty()],
  validateRequest,
  express.raw({ type: 'application/json' }),
  webhookCheckout,
  async (req: Request, res: Response) => {
    const { client_reference_id: orderId, id: stripeId } = req.session;

    try {
      if (!orderId) {
        throw new BadRequestError('Invalid request');
      }

      const order = await Order.findById(orderId);

      if (!order) {
        throw new NotFoundError();
      }

      if (order.userId !== req.currentUser!.id) {
        throw new NotAuthorizedError();
      }

      if (order.status === OrderStatus.Cancelled) {
        throw new BadRequestError('Cannot pay for an cancelled order');
      }

      const payment = Payment.build({
        orderId,
        stripeId,
      });

      await payment.save();

      new PaymentCompletePublisher(natsWrapper.client).publish({
        id: payment.id,
        orderId: payment.orderId,
        stripeId: payment.stripeId,
      });

      res.status(201).send(payment);
    } catch (error) {
      await stripe.paymentIntents.cancel(stripeId);
      throw error;
    }
  }
);

export { router as createChargeRouter };
