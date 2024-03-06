import { Listener, OrderCreatedEvent, Subjects } from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { expirationQueue } from '../../queues/expiration-queue';

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: OrderCreatedEvent['data'],
    msg: Message
  ): Promise<void> {
    const { id } = data;

    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    const date = new Date();
    console.log(
      `Waiting ${date.getMinutes()}:${date.getSeconds()} minutes to process the job`
    );

    await expirationQueue.add(
      {
        orderId: id,
      },
      {
        delay,
      }
    );

    msg.ack();
  }
}
