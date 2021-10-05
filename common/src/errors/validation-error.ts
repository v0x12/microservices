import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";

export class RequestValidationError extends CustomError {
  public statusCode: number = 400;

  constructor(public errors?: ValidationError[]) {
    super("Invalid request parameters.");
    // When extentind the built-in class
    Object.setPrototypeOf(this, RequestValidationError.prototype);
  }
  public serializeErrors(): { message: string; field?: string | undefined }[] {
    const formattedError = this.errors?.map((error) => {
      return {
        message: error.msg,
        field: error.param!,
      };
    });
    // @ts-ignore
    return formattedError;
  }
}
