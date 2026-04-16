import { UserProps } from '../props/user.props';

export class UserEntity {
  constructor(private readonly props: UserProps) {}

  get id(): string {
    return this.props.id;
  }

  get firstname(): string {
    return this.props.firstname;
  }

  get surname(): string {
    return this.props.surname;
  }

  get email(): string {
    return this.props.email;
  }

  get birthdate(): Date {
    return this.props.birthdate;
  }

  get active(): boolean {
    return this.props.active;
  }

  get emailVerified(): boolean {
    return this.props.emailVerified;
  }

  get createdAt(): Date {
    return this.props.createdAt;
  }

  get updatedAt(): Date {
    return this.props.updatedAt;
  }

  get deletedAt(): Date | null | undefined {
    return this.props.deletedAt;
  }

  confirmEmail(): void {
    this.props.active = true;
    this.props.emailVerified = true;
    this.props.updatedAt = new Date();
  }
}
