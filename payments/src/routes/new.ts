import {
  BadRequestError,
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@rjmicrotix/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import { Order } from '../models/Order';
import { stripe } from '../stripe';

const router = express.Router();

router.post(
  '/api/payments',
  requireAuth,
  [body('orderId').notEmpty()],
  validateRequest,
  async (req: Request, res: Response) => {
    const { orderId } = req.body;

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

    // 2) Create checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      billing_address_collection: 'required',
      shipping_address_collection: {
        allowed_countries: [
          'IN',
          'US',
          'CA',
          'GB' /* other countries where you have customers */,
        ],
      },
      line_items: [
        {
          price_data: {
            currency: 'inr',
            unit_amount: order.ticket.price * 100,
            product_data: {
              name: order.ticket.title,
            },
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      // NOTE: Not a secure way to do this. Use a webhook instead
      // success_url: `${req.protocol}://${req.get('host')}/?tour=${
      //   req.params.tourId
      // }&user=${req.user.id}&price=${tour.price}`,
      success_url: `${req.protocol}://${req.get('host')}/tickets`,
      cancel_url: `${req.protocol}://${req.get('host')}/tickets`,
      customer_email: req.currentUser!.email,
      client_reference_id: req.params.tourId,
    });

    res.status(200).send(session);
  }
);

export { router as createChargeRouter };
