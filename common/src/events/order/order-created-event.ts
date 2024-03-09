import { OrderStatus } from '../types/order-status';
import { Subjects } from '../types/subjects';

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    version: number;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      title: string;
      id: string;
      price: number;
    };
  };
}
