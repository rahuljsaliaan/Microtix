import { ValidationError } from 'express-validator';

export class RequestValidationError extends Error {
  constructor(public errors: ValidationError[]) {
    super();

    // NOTE: Only because we are extending a built in class (only used in ts to solve transpilation issues in classes)
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
}
