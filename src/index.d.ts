export declare type TurnstileConstructorArgs = {
    token: string;
};

export declare type TurnstileValidateArgs = {
    response: string;
    remoteip?: string;
    idempotency_key?: string;
};

export declare type TurnstileValidationResponse = {
    valid: boolean;
    messages: string[];
};