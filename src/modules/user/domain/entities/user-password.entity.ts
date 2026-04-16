import { UserPasswordProps } from '../props/user-password.props';

export class UserPasswordEntity {
  constructor(private readonly props: UserPasswordProps) {}

  get id(): string {
    return this.props.id;
  }

  get userId(): string {
    return this.props.userId;
  }

  get passwordHash(): string {
    return this.props.passwordHash;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }
}
