export type UserProps = {
  id: string;
  firstname: string;
  surname: string;
  email: string;
  birthdate: Date;
  active: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date | null;
};
