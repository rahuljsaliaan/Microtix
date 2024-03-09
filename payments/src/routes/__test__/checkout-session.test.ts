import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import { OrderStatus } from '@rjmicrotix/common';
import { stripe } from '../../stripe';

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

it('returns Stripe session object', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
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

  expect(stripe.checkout.sessions.create).toHaveBeenCalled();
  expect(response.status).toEqual(200);
});
