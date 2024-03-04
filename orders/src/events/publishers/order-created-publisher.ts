import { OrderCreatedEvent, Publisher, Subjects } from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;

  constructor(client: Stan) {
    super(client);
  }
}
