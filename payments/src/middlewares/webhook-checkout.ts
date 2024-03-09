import { NextFunction, Request, Response } from 'express';
import { stripe } from '../stripe';
import Stripe from 'stripe';
import { BadRequestError } from '@rjmicrotix/common';

declare global {
  namespace Express {
    interface Request {
      session: Stripe.Checkout.Session;
    }
  }
}

export const webhookCheckout = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // NOTE: Getting the signature from the headers
  const signature = req.headers['stripe-signature'];

  let event;

  if (!signature)
    throw new BadRequestError('Stripe signature verification failed');

  event = stripe.webhooks.constructEvent(
    req.body,
    signature,
    process.env.STRIPE_SECRET!
  );

  if (event?.type !== 'checkout.session.completed') {
    throw new BadRequestError('Checkout Session Failed');
  }

  req.session = event.data.object; // Add the event to the req object
  next();
};
