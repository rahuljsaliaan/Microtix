import request from 'supertest';
import { app } from '../../app';
import mongoose from 'mongoose';
import { Order } from '../../models/Order';
import { OrderStatus } from '@rjmicrotix/common';

it('returns a 404 when purchasing order that does not exist', async () => {
  return request(app)
    .post('/webhook-checkout')
    .set('Cookie', global.signin())
    .set('stripe-signature', '{}')
    .send({
      data: {
        object: {
          client_reference_id: new mongoose.Types.ObjectId().toHexString(),
        },
      },
    })
    .expect(404);
});

it('returns a 401 when purchasing order that does not belong to the user', async () => {
  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    ticket: {
      title: 'test',
      price: 200,
    },
    status: OrderStatus.Created,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/webhook-checkout')
    .set('Cookie', global.signin())
    .set('stripe-signature', '{}')
    .send({
      data: {
        object: {
          client_reference_id: order.id,
        },
      },
    })
    .expect(401);
});

it('returns a 400 when purchasing a cancelled order', async () => {
  const userId = new mongoose.Types.ObjectId().toHexString();

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId,
    ticket: {
      title: 'test',
      price: 200,
    },
    status: OrderStatus.Cancelled,
    version: 0,
  });

  await order.save();

  await request(app)
    .post('/webhook-checkout')
    .set('Cookie', global.signin(userId))
    .set('stripe-signature', '{}')
    .send({
      data: {
        object: {
          client_reference_id: order.id,
        },
      },
    })
    .expect(400);
});
