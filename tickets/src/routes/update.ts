import express, { Request, Response } from 'express';
import { body, oneOf } from 'express-validator';
import { Ticket } from '../models/Ticket';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@rjmicrotix/common';
import { natsWrapper } from '../nats-wrapper';
import { TicketUpdatedPublisher } from '../events/publishers/ticket-updated-publisher';

const router = express.Router();

router.put(
  '/api/tickets/:id',
  requireAuth,
  [
    body('title').optional().notEmpty().withMessage('Title is required'),
    body('price')
      .optional()
      .isFloat({ gt: 0 })
      .withMessage('Price must be greater than 0'),
    oneOf([body('title').exists(), body('price').exists()]),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      throw new NotFoundError();
    }

    if (ticket.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    const { title, price } = req.body;

    const updates = { title, price };
    Object.assign(ticket, updates);

    if (ticket.isModified()) {
      await ticket.save();

      await new TicketUpdatedPublisher(natsWrapper.client).publish({
        id: ticket.id,
        title: ticket.title,
        price: ticket.price,
        userId: ticket.userId,
        version: ticket.version,
      });
    }

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
