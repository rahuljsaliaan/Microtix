import mongoose from 'mongoose';
import { Ticket } from '../../../models/Ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';
import { Subjects, TicketUpdatedEvent } from '@rjmicrotix/common';

const setup = async () => {
  // Create a listener
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const id = new mongoose.Types.ObjectId().toHexString();
  const userId = new mongoose.Types.ObjectId().toHexString();

  // Create and save a ticket
  const ticket = Ticket.build({
    id,
    title: 'test',
    price: 200,
  });

  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id,
    version: 1,
    title: 'new test',
    price: 300,
    userId,
  };

  // Create a fake message object
  // @ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  // Return all of this stuff
  return { listener, data, msg };
};

it('finds updates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure a ticket was updated
  const { id, title, price } = data;

  const updatedTicket = await Ticket.findById(id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toEqual(title);
  expect(updatedTicket!.price).toEqual(price);
});

it('acks the message', async () => {
  const { listener, data, msg } = await setup();

  // Call the onMessage function with the data object + message object
  await listener.onMessage(data, msg);

  // Write assertions to make sure the ack function is called
  expect(msg.ack).toHaveBeenCalled();
});
