import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError {
  public statusCode: number = 500;
  public reason: string = "Unable to connect to database";

  constructor() {
    super("Database connection error.");
    Object.setPrototypeOf(this, DatabaseConnectionError.prototype);
  }

  public serializeErrors() {
    return [{ message: this.reason }];
  }
}
