import { OrderCancelled, Publisher, Subjects } from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class OrderCancelledEvent extends Publisher<OrderCancelled> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;

  constructor(client: Stan) {
    super(client);
  }
}
