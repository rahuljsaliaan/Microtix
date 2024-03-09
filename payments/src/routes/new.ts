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

const router = express.Router();

router.post(
  '/webhook-checkout',
  [header('stripe-signature').notEmpty()],
  validateRequest,
  express.raw({ type: 'application/json' }),
  webhookCheckout,
  async (req: Request, res: Response) => {
    const orderId = req.session!.client_reference_id as string;

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

    res.send({ success: true });
  }
);

export { router as createChargeRouter };
