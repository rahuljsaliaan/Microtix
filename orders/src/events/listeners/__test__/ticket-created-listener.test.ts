import { TicketCreatedEvent } from '@rjmicrotix/common';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/Ticket';

const setup = async () => {
  // instance of the listener
  const listener = new TicketCreatedListener(natsWrapper.client);

  // Create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'test',
    price: 200,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was created\
  const { id, title, price } = data;

  const ticket = await Ticket.findById(id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toEqual(title);
  expect(ticket!.price).toEqual(price);
});

it('acknowledges the messages', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
