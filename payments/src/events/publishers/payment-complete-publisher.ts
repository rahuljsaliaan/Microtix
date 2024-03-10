import { PaymentCompleteEvent, Publisher, Subjects } from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class PaymentCompletePublisher extends Publisher<PaymentCompleteEvent> {
  readonly subject: Subjects.PaymentComplete = Subjects.PaymentComplete;

  constructor(client: Stan) {
    super(client);
  }
}
