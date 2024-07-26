// **Interfaces**

/**
 * Defines the arguments required to create a new TurnstileVerify instance.
 */
export type TurnstileConstructorArgs = {
  /**
   * The access token used for validation with Cloudflare Turnstile.
   */
  token: string;
};

/**
 * Defines the arguments accepted by the `validate` method of TurnstileVerify.
 */
export type TurnstileValidateArgs = {
  /**
   * The user's response from the Cloudflare Turnstile challenge.
   */
  response: string;

  /**
   * Optional: The user's remote IP address. Can be useful for fraud detection.
   */
  remoteip?: string;

  /**
   * Optional: An idempotency key to ensure only one validation is processed per key.
   */
  idempotency_key?: string;
};

/**
 * Defines the structure of the response object returned by the `validate` method.
 */
export type TurnstileValidationResponse = {
  /**
   * Indicates whether the validation was successful.
   */
  valid: boolean;

  /**
   * An array of messages related to the validation result.
   * - On success, contains a single "success" message.
   * - On failure, contains error codes from Cloudflare Turnstile.
   */
  messages: string[];
};

// **TurnstileVerify Class**

export class TurnstileVerify {
  private readonly accessToken: string;

  /**
   * Creates a new TurnstileVerify instance.
   * @param args - The arguments required for initialization.
   */
  constructor(args: TurnstileConstructorArgs) {
    this.accessToken = args.token;
  }

  /**
   * Validates a user's response from a Cloudflare Turnstile challenge.
   * @param validationArgs - The arguments containing the user's response and optional data.
   * @returns A Promise resolving to a TurnstileValidationResponse object.
   */
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
