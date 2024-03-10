import { NotFoundError, requireAuth } from '@rjmicrotix/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import { stripe } from '../stripe-config';

const router = express.Router();

router.get(
  '/api/payments/checkout-session/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new NotFoundError();
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
            product_data: {
              name: order.ticket.title,
              description: `Order for ticket: ${order.ticket.title}`,
            },
            unit_amount: order.ticket.price * 100,
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
      client_reference_id: orderId,
    });

    res.send(session);
  }
);

export { router as checkoutSessionRouter };
