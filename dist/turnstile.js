var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export class TurnstileVerify {
    constructor(args) {
        this.accessToken = args.token;
    }
    validate(validationArgs) {
        return __awaiter(this, void 0, void 0, function* () {
            const form = new FormData();
            form.append('secret', this.accessToken);
            form.append('response', validationArgs.response);
            if (validationArgs.remoteip) {
                form.append('remoteip', validationArgs.remoteip);
            }
            if (validationArgs.idempotency_key) {
                form.append('idempotency_key', validationArgs.idempotency_key);
            }
            const verificationUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
            const response = yield fetch(verificationUrl, {
                body: form,
                method: 'POST',
            });
            const verificationResponse = yield response.json();
            if (!verificationResponse.success) {
                return {
                    valid: false,
                    messages: verificationResponse['error-codes'],
                };
            }
            return {
                valid: true,
                messages: ["success"],
            };
        });
    }
}
