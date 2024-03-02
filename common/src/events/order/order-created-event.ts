import { OrderStatus } from '../types/order-status';
import { Subjects } from '../types/subjects';

export interface OrderCreated {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    status: OrderStatus;
    userId: string;
    expiresAt: string;
    ticket: {
      id: string;
      price: number;
    };
  };
}
