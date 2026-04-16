import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from '../../common/common.module';
import { EmailModule } from '../email/email.module';
import { UserController } from './api/controllers/user.controller';
import { IUserPasswordRepository } from './application/ports/i-user-password.repository';
import { IUserRepository } from './application/ports/i-user.repository';
import { ChangePasswordUseCase } from './application/use-cases/change-password.use-case';
import { CreateUserUseCase } from './application/use-cases/create-user.use-case';
import { SaveUserPasswordUseCase } from './application/use-cases/save-user-password.use-case';
import { UserPasswordOrmEntity } from './infra/orm-entities/user-password.orm-entity';
import { UserOrmEntity } from './infra/orm-entities/user.orm-entity';
import { UserPasswordRepository } from './infra/repositories/user-password.repository';
import { UserRepository } from './infra/repositories/user.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserOrmEntity, UserPasswordOrmEntity]),
    CommonModule,
    EmailModule,
  ],
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    SaveUserPasswordUseCase,
    ChangePasswordUseCase,
    { provide: IUserRepository, useClass: UserRepository },
    { provide: IUserPasswordRepository, useClass: UserPasswordRepository },
  ],
  exports: [IUserRepository, IUserPasswordRepository],
})
export class UserModule {}
