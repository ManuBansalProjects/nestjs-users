import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from './entities/user.entities';
import { UsersModule } from './users/users/users.module';
import { EmailModule } from './email-service/email/email.module';


@Module({
  imports: [
    ConfigModule.forRoot({isGlobal: true}),

    // TypeOrmModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: (configService: ConfigService)=>({
    //     type: 'postgres',
    //     host: configService.get('DB_HOST'),
    //     port: +configService.get<number>('DB_PORT'),
    //     username: configService.get('DB_USERNAME'),
    //     password: configService.get('DB_PASSWORD'),
    //     database: configService.get('DB_NAME'),
    //     synchronize: configService.get<boolean>('DB_SYNC'),
    //     entities: [__dirname + '/**/*.entity{.ts, .js}'],
    //     logging: true
    //   }),
    //   inject: [ConfigService],
    // }),

    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Manubansal@444',
      database: 'demo',
      schema: 'bookmyshow',
      entities: [Users],
    }),

    TypeOrmModule.forFeature([Users]),

    UsersModule,

    EmailModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
