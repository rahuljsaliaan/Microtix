import { Listener, OrderCreatedEvent, Subjects } from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;
  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id, userId, status, version, ticket } = data;

    const order = Order.build({
      id,
      userId,
      price: ticket.price,
      status,
      version,
    });

    await order.save();

    msg.ack();
  }
}
