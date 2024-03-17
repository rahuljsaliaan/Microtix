import {
  NotAuthorizedError,
  NotFoundError,
  OrderStatus,
  requireAuth,
} from '@rjmicrotix/common';
import express, { Request, Response } from 'express';
import { Order } from '../models/Order';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');

    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    // Update the order status to cancelled
    order.status = OrderStatus.Cancelled;

    if (order.isModified()) {
      await order.save();

      const { id, ticket, version } = order;

      // Publish an event saying that the order was cancelled
      new OrderCancelledPublisher(natsWrapper.client).publish({
        id,
        ticket: {
          id: ticket.id,
        },
        version,
      });
    }

    res.status(204).send();
  }
);

export { router as deleteOrderRouter };
