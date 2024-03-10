import { Listener, OrderStatus, Subjects } from '@rjmicrotix/common';
import { OrderCreatedEvent } from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If no ticket, throw error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as reserved by setting the orderId property
    ticket.set({ orderId: data.id });

    if (ticket.isModified()) {
      // Save the ticket
      await ticket.save();

      // Publish the ticket-updated event
      const { id, price, title, userId, orderId, version } = ticket;

      new TicketUpdatedPublisher(this.client).publish({
        id,
        price,
        title,
        userId,
        orderId,
        version,
      });
    }

    // Acknowledge the message
    msg.ack();
  }
}
