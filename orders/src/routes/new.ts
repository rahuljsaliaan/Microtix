import express, { Request, Response } from 'express';
import {
  BadRequestError,
  NotFoundError,
  OrderStatus,
  requireAuth,
  validateRequest,
} from '@rjmicrotix/common';
import { body } from 'express-validator';
import { Ticket } from '../models/Ticket';
import { Order } from '../models/Order';
import { OrderCreatedPublisher } from '../events/publishers/order-created-publisher';
import { natsWrapper } from '../nats-wrapper';

const router = express.Router();

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

router.post(
  '/api/orders',
  requireAuth,
  [
    body('ticketId')
      .notEmpty()
      // ! Not a good idea because we are assuming the ticket service structure to be of a particular structure (this creates coupling)
      // .custom((input: string) => mongoose.Types.ObjectId.isValid(input))
      .withMessage('TicketId must be provided'),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { ticketId } = req.body;

    // Find the ticket that the user is trying to order in the database
    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      throw new NotFoundError();
    }

    // Make sure that this ticket is not already reserved
    const isReserved = await ticket.isReserved();

    if (isReserved) {
      throw new BadRequestError('Ticket is already reserved');
    }

    // Calculate an expiration date for this order
    const expiration = new Date();
    expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

    // Build the order and save it to the database
    const order = Order.build({
      userId: req.currentUser!.id,
      status: OrderStatus.Created,
      expiresAt: expiration,
      ticket,
    });

    await order.save();

    const { id, status, userId, expiresAt, version } = order;

    // Publish an event saying that the order was created
    new OrderCreatedPublisher(natsWrapper.client).publish({
      id,
      status,
      userId,
      expiresAt: expiresAt.toISOString(),
      ticket: {
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
      },
      version,
    });

    res.status(201).send(order);
  }
);

export { router as createOrderRouter };
