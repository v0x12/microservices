import { ValidationError } from "express-validator";
import { CustomError } from "./custom-error";
export declare class RequestValidationError extends CustomError {
    errors?: ValidationError[] | undefined;
    statusCode: number;
    constructor(errors?: ValidationError[] | undefined);
    serializeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
