import request from 'supertest';
import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signin())
    .send({ title, price });
};

it('can fetch a list of tickets', async () => {
  await createTicket('test1', 200);
  await createTicket('test2', 300);
  await createTicket('test3', 400);

  const response = await request(app).get('/api/tickets').send({}).expect(200);

  expect(response.body.length).toEqual(3);
});
