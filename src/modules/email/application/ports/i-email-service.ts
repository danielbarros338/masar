export abstract class IEmailService {
  abstract sendEmailConfirmation(to: string, token: string): Promise<void>;
  abstract sendForgotPassword(to: string): Promise<void>;
}
