import express, { Request, Response } from 'express';
import { body, oneOf } from 'express-validator';
import { Ticket } from '../models/Ticket';
import {
  validateRequest,
  NotFoundError,
  requireAuth,
  NotAuthorizedError,
} from '@rjmicrotix/common';

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

    if (title !== undefined) {
      ticket.title = title;
    }

    if (price !== undefined) {
      ticket.price = price;
    }

    await ticket.save();

    res.send(ticket);
  }
);

export { router as updateTicketRouter };
