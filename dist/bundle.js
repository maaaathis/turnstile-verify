declare type TurnstileConstructorArgs = {
    token: string;
};

declare type TurnstileValidateArgs = {
    response: string;
    remoteip?: string;
    idempotency_key?: string;
};

declare type TurnstileValidationResponse = {
    valid: boolean;
    messages: string[];
};

export type { TurnstileConstructorArgs, TurnstileValidateArgs, TurnstileValidationResponse };
//# sourceMappingURL=bundle.js.map
