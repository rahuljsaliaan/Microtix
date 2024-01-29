import { ValidationError } from 'express-validator';
import { CustomError } from './custom-error';

export class RequestValidationError extends CustomError {
  statusCode = 400;

  constructor(public errors: ValidationError[]) {
    super('Invalid request parameters');

    // NOTE: Only because we are extending a built in class (only used in ts to solve transpilation issues in classes)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }

  serializeErrors() {
    return this.errors.map((error) => {
      if (error.type === 'field')
        return { message: error.msg, field: error.path };

      return { message: error.msg };
    });
  }
}
