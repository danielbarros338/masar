import { IsEmail } from 'class-validator';

export class SendEmailConfirmationDto {
  @IsEmail()
  email: string;
}
