import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailDetailsDto } from 'src/dto/user.dto';

@Injectable()
export class EmailService {
    constructor(private readonly mailerService: MailerService){}

    async sendUserConfirmation(details: EmailDetailsDto): Promise<any>{
        console.log(details);
        const result=await this.mailerService.sendMail({
            to: details.email,
            // from: '"Support Team" <support@example.com>', // override default from
            subject: 'Welcome to nestjs mailing service',
            
            text: details.text,
            
            // html: '<h1>NestJs Email Service is working </h1>'

            // template: './templates/confirmation',
            // context:{
            //     name: user.name,
            //     url: url,
            // }
        });
        return result;
    }
    
}
