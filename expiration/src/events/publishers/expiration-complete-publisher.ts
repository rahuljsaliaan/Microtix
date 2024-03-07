import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@rjmicrotix/common';
import { Stan } from 'node-nats-streaming';

export class ExpirationComplete extends Publisher<ExpirationCompleteEvent> {
  readonly subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;

  constructor(client: Stan) {
    super(client);
  }
}
