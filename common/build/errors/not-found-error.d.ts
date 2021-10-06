import { CustomError } from "./custom-error";
export declare class NotFoundError extends CustomError {
    errorMessage?: string | undefined;
    statusCode: number;
    constructor(errorMessage?: string | undefined);
    serializeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
