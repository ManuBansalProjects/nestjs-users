import { Controller, Post , UseGuards, UsePipes, Body, Headers, Res, Req} from "@nestjs/common";
import { Response } from "express";
import { UsersService } from "./users.service";
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { ChangePasswordDto, CreateUserDto, EmailDetailsDto, ForgotpasswordDto } from "src/dto/user.dto";
import { Users } from "src/entities/user.entities";
import * as bcrypt from 'bcrypt';
import { UserAuthGuard } from "src/guards/user-auth/user-auth.guard";
import { JwtService } from "@nestjs/jwt";
import { EmailService } from "src/email-service/email/email.service";
import { UserRegistrationGuard } from "src/guards/user-registration/user-registration.guard";
import { JwtExistsGuard } from "src/guards/jwt-exists/jwt-exists.guard";


@Controller('auth')
export class AuthController{

    constructor(private readonly usersService: UsersService, private jwtService: JwtService, private emailService: EmailService){}

    @Post('/registration')
    @UseGuards(UserRegistrationGuard)
    @UsePipes(ValidationPipe)
    async registration(@Body() createUser: CreateUserDto){
        try{
            let user:CreateUserDto=createUser;
            const saltOrRounds=await bcrypt.genSalt();
            user.password=await bcrypt.hash(user.password, saltOrRounds);
            const result= await this.usersService.registration(user);
            return {message: 'registration successfull', result};
        }
        catch(error){
            throw error;
        }
    } 

    @Post('/login')
    @UseGuards(UserAuthGuard)
    async login(@Res() res: Response){
        try{
            const tokenDetails={
                email: this.usersService.currentUser.email, 
                password: this.usersService.currentUser.password, 
                role: this.usersService.currentUser.role
            }
            const jwtToken=await this.usersService.generateToken(tokenDetails);
            await this.usersService.saveJwtToDatabase(jwtToken);
            res.cookie('access_token', jwtToken, {httpOnly: true});
            res.json({message:'login successfull'});
        }
        catch(error){
            throw error;
        }
    }

    @Post('/forgot-password')
    @UsePipes(ValidationPipe)
    async forgotPassword(@Body() forgotPasswordDto: ForgotpasswordDto){
        try{    
            const tokenDetails={
                email: forgotPasswordDto.email
            }
            const jwtToken=this.jwtService.sign(tokenDetails);
            let emailDetails: EmailDetailsDto={email:'', text:''};
            emailDetails.email=forgotPasswordDto.email;
            emailDetails.text=`Please click on the link below for generate new password \n http://localhost:4200/users/changepassword/${jwtToken}`;
            const result=await this.emailService.sendUserConfirmation(emailDetails);
            return {message: 'email success, you will recieve a email, if it exists', result};
        }
        catch(error){
            throw error;
        }
    }

    @Post('/check-jwt-for-password-change')
    @UseGuards(JwtExistsGuard)
    checkJwtForpasswordChange(){
        return {message: 'jwt success', statusCode: 201};
    }

    @Post('/reset-password')
    @UseGuards(JwtExistsGuard)
    @UsePipes(ValidationPipe)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Headers('authorization') jwt: string){
        try{
            const jwtToken=jwt.split(' ')[1];
            const result=await this.jwtService.verifyAsync(jwtToken, {secret: 'SecretKey'});
            const saltOrRounds=await bcrypt.genSalt();
            const res=await this.usersService.resetPassword(result.email, await bcrypt.hash(changePasswordDto.password, saltOrRounds));
            return {message: 'password updated', res};
        }
        catch(error){
            throw error;
        }
    }


}