import { Request, Response, NextFunction } from 'express';
import { CustomError } from '../errors/custom-error';

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (error instanceof CustomError) {
    return res
      .status(error.statusCode)
      .send({ errors: error.serializeErrors() });
  }

  console.error('💥💥💥', error);

  res.status(400).send({
    errors: [
      {
        message: 'Something went wrong',
      },
    ],
  });
};
