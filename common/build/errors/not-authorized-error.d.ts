import { CustomError } from "./custom-error";
export declare class NotAuthorizedError extends CustomError {
    errorMessage?: string | undefined;
    statusCode: number;
    constructor(errorMessage?: string | undefined);
    serializeErrors(): {
        message: string;
        field?: string | undefined;
    }[];
}
