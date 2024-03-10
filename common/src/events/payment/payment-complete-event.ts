import { Subjects } from '../types/subjects';

export interface PaymentCompleteEvent {
  subject: Subjects.PaymentComplete;
  data: {
    id: string;
    orderId: string;
    stripeId: string;
  };
}
