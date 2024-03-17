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
        allowed_countries: ['IN', 'US', 'CA', 'GB'],
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
      success_url: `${req.protocol}://${req.get('host')}/orders`,
      cancel_url: `${req.protocol}://${req.get('host')}/`,
      customer_email: req.currentUser!.email,
      client_reference_id: orderId,
    });

    res.send(session);
  }
);

export { router as checkoutSessionRouter };
