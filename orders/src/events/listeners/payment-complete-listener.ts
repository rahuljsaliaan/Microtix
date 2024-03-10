import {
  Listener,
  OrderStatus,
  PaymentCompleteEvent,
  Subjects,
} from '@rjmicrotix/common';
import { queueGroupName } from './queue-group-name';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/Order';

export class PaymentCompleteListener extends Listener<PaymentCompleteEvent> {
  readonly subject: Subjects.PaymentComplete = Subjects.PaymentComplete;

  readonly queueGroupName: string = queueGroupName;

  async onMessage(
    data: PaymentCompleteEvent['data'],
    msg: Message
  ): Promise<void> {
    const { orderId } = data;

    const order = await Order.findById(orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    // NOTE: The reason why we are not publishing the order updated event is because after the order is complete no other service can update it
    order.set({
      status: OrderStatus.Complete,
    });

    await order.save();

    msg.ack();
  }
}
