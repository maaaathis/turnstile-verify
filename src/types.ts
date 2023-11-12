export type TurnstileConstructorArgs = {
    token: string
}
export type TurnstileValidateArgs = {
    response: string,
    remoteip?: string,
    idempotency_key?: string
}

export type TurnstileValidationResponse = {
    valid: boolean,
    messages: string[]
}