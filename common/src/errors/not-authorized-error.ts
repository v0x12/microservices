import { CustomError } from "./custom-error";

export class NotAuthorizedError extends CustomError {
  statusCode: number = 401;
  constructor(public errorMessage?: string) {
    super("Not Authorized Error.");

    Object.setPrototypeOf(this, NotAuthorizedError.prototype);
  }
  serializeErrors(): { message: string; field?: string | undefined }[] {
    return [{ message: this.errorMessage || "Not authorized. Please log in." }];
  }
}
