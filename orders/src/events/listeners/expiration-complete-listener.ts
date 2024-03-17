import {
  ExpirationCompleteEvent,
  Listener,
  OrderStatus,
  Subjects,
} from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import { natsWrapper } from '../../nats-wrapper';

export class ExpirationCompleteListener extends Listener<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: ExpirationCompleteEvent['data'],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }

    if (order.status === OrderStatus.Complete) {
      return msg.ack();
    }

    order.set({
      status: OrderStatus.Cancelled,
    });

    if (order.isModified()) {
      await order.save();

      const { id, version, ticket } = order;

      new OrderCancelledPublisher(natsWrapper.client).publish({
        id,
        version,
        ticket: {
          id: ticket.id,
        },
      });
    }

    msg.ack();
  }
}
