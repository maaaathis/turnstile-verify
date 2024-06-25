export type TurnstileConstructorArgs = {
  token: string;
};
export type TurnstileValidateArgs = {
  response: string;
  remoteip?: string;
  idempotency_key?: string;
};

export type TurnstileValidationResponse = {
  valid: boolean;
  messages: string[];
};

export class TurnstileVerify {
  private readonly accessToken: string;

  constructor(args: TurnstileConstructorArgs) {
    this.accessToken = args.token;
  }

  async validate(
    validationArgs: TurnstileValidateArgs
  ): Promise<TurnstileValidationResponse> {
    const form = new FormData();
    form.append('secret', this.accessToken);
    form.append('response', validationArgs.response);
    if (validationArgs.remoteip) {
      form.append('remoteip', validationArgs.remoteip);
    }
    if (validationArgs.idempotency_key) {
      form.append('idempotency_key', validationArgs.idempotency_key);
    }

    const verificationUrl =
      'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const response = await fetch(verificationUrl, {
      body: form,
      method: 'POST',
    });

    const verificationResponse = await response.json();

    if (!verificationResponse.success) {
      return {
        valid: false,
        messages: verificationResponse['error-codes'],
      };
    }

    return {
      valid: true,
      messages: ['success'],
    };
  }
}
