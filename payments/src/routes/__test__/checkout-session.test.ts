import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import { OrderStatus } from '@rjmicrotix/common';
import { stripe } from '../../stripe-config';

it('can only be accessed if user is signed in', async () => {
  const response = await request(app)
    .get(
      `/api/payments/checkout-session/${new mongoose.Types.ObjectId().toHexString()}`
    )
    .send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .get(
      `/api/payments/checkout-session/${new mongoose.Types.ObjectId().toHexString()}`
    )
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns a Stripe checkout session for a valid order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    status: OrderStatus.Created,
    ticket: {
      title: 'test',
      price: 200,
    },
    version: 0,
  });

  await order.save();

  const response = await request(app)
    .get(`/api/payments/checkout-session/${order.id}`)
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).toEqual(200);

  // Fetch the checkout session from Stripe
  const stripeSession = await stripe.checkout.sessions.retrieve(
    response.body.id
  );

  // Check that the checkout session was created correctly
  expect(stripeSession.payment_status).toBe('unpaid');
  expect(stripeSession.mode).toBe('payment');
});
