import { Publisher, Subjects, TicketUpdatedEvent } from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;

  constructor(client: Stan) {
    super(client);
  }
}
