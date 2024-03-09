import { Listener, OrderCancelledEvent, Subjects } from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../models/Ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // NOTE: Optional values works well with undefined than null
    ticket.set({ orderId: undefined });

    if (ticket.isModified()) {
      await ticket.save();

      const { id, version, title, price, userId, orderId } = ticket;

      await new TicketUpdatedPublisher(this.client).publish({
        id,
        version,
        title,
        price,
        userId,
        orderId,
      });
    }

    msg.ack();
  }
}
