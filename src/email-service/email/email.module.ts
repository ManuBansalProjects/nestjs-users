import { Global, Module } from '@nestjs/common';
import { EmailService } from './email.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { join } from 'path';
import {HandlebarsAdapter} from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';

// @Global()  -> if you are mkaing this module Global
@Module({
  imports :[
    MailerModule.forRoot({
      transport:{
        host: 'smtp.gmail.com',
        secure: false,
        auth:{
          user: 'manubansal.cse23@jecrc.ac.in',
          pass: 'Manubansaljecrc@444',
        },
      },
      defaults:{
        from: ' "No Reply" <noreply@example.com> ',
      },
      // template:{
      //   dir: __dirname + '/templates',
      //   adapter: new HandlebarsAdapter(),
      //   options:{
      //     strict: true,
      //   }
      // }
    })
  ],
  providers: [EmailService],
  exports:[EmailService]
})


export class EmailModule {}
