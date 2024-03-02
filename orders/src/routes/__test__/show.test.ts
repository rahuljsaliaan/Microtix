import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/Ticket';

it('can only be accessed if user is signed in', async () => {
  const response = await request(app).post('/api/orders').send({});

  expect(response.status).toEqual(401);
});

it('returns a status other than 401 if the user is signed in', async () => {
  const response = await request(app)
    .post('/api/orders')
    .set('Cookie', global.signin())
    .send({});

  expect(response.status).not.toEqual(401);
});

it('returns a 404 if the order is not found', async () => {
  const user = global.signin();

  const id = new mongoose.Types.ObjectId().toHexString();
  return request(app)
    .get(`/api/orders/${id}`)
    .set('Cookie', user)
    .send({})
    .expect(404);
});

it('returns a 401 if the order does not belong to the user', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 200,
  });

  await ticket.save();

  const user1 = global.signin();

  // Make a request to build and order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket.id })
    .expect(201);

  const user2 = global.signin();

  await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user2)
    .send({})
    .expect(401);
});

it('returns the order if order is found', async () => {
  // Create a ticket
  const ticket = Ticket.build({
    title: 'test',
    price: 200,
  });

  await ticket.save();

  const user = global.signin();

  // Make a request to build and order with this ticket
  const { body: order } = await request(app)
    .post('/api/orders')
    .set('Cookie', user)
    .send({ ticketId: ticket.id })
    .expect(201);

  // Make a request to fetch the order
  const { body: fetchedOrder } = await request(app)
    .get(`/api/orders/${order.id}`)
    .set('Cookie', user)
    .send({})
    .expect(200);

  expect(fetchedOrder.id).toEqual(order.id);
});
