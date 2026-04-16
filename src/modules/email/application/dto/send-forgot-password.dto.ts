import { IsEmail } from 'class-validator';

export class SendForgotPasswordDto {
  @IsEmail()
  email: string;
}
