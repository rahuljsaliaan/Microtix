import { Subjects } from '../types/subjects';

export interface OrderCancelled {
  subject: Subjects.OrderCancelled;
  data: {
    id: string;
    ticket: {
      id: string;
    };
  };
}
