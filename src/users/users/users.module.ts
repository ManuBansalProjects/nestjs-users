import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { Users } from 'src/entities/user.entities';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmailModule } from 'src/email-service/email/email.module';
import { JwtModule } from '@nestjs/jwt/dist';
import { AuthController } from './auth.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Users]),
    EmailModule,
    JwtModule.register({
      global: true,
      secret: 'SecretKey',
      signOptions: {expiresIn: '1800s'}
    })    
  ],
  providers: [UsersService],
  controllers: [UsersController, AuthController ]
})
export class UsersModule {}
