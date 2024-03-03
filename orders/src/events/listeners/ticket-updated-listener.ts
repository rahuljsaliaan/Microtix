import {
  Listener,
  NotFoundError,
  Subjects,
  TicketUpdatedEvent,
} from '@rjmicrotix/common';
import { Message, Stan } from 'node-nats-streaming';
import { queueGroupName } from './queue-group-name';
import { Ticket } from '../../models/Ticket';

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: TicketUpdatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, title, price, version } = data;

    // NOTE: Find the ticket with the given id and the previous version number to ensure we're updating the correct version of the ticket (Solves concurrency issue).
    const ticket = await Ticket.findByEvent({ id, version });

    if (!ticket) {
      throw new NotFoundError();
    }

    ticket.set({ title, price, version });

    await ticket.save();

    msg.ack();
  }

  constructor(client: Stan) {
    super(client);
  }
}
