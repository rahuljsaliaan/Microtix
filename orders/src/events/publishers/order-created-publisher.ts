import { OrderCreated, Publisher, Subjects } from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class OrderCreatedPublisher extends Publisher<OrderCreated> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;

  constructor(client: Stan) {
    super(client);
  }
}
