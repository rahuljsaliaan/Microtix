export enum OrderStatus {
  // When the order has been created, and the ticket has been reserved
  Created = 'created',

  // The user has cancelled the order.
  // The order expires before payment
  Cancelled = 'cancelled',

  // The order has reserved the ticket and the user has provided payment successfully
  Complete = 'complete',
}
