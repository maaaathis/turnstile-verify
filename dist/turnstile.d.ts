import { TurnstileConstructorArgs, TurnstileValidateArgs, TurnstileValidationResponse } from "./types";
export declare class TurnstileVerify {
    private accessToken;
    constructor(args: TurnstileConstructorArgs);
    validate(validationArgs: TurnstileValidateArgs): Promise<TurnstileValidationResponse>;
}
