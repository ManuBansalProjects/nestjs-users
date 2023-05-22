import { Controller, Post, Body, HttpException, BadRequestException, UsePipes, UnauthorizedException, Headers, Get, Put, Res } from '@nestjs/common';
import { Response, Request } from 'express';
import { ChangePasswordDto, CreateUserDto, CurrentuserDto, EmailDetailsDto, ForgotpasswordDto, LoginUserDto, UpdatedUserDto } from 'src/dto/user.dto';
import { UsersService } from './users.service';
import { EmailService } from 'src/email-service/email/email.service';
import { ParseIntPipe, ValidationPipe } from '@nestjs/common/pipes';
import { Delete, Param, Req, UseGuards } from '@nestjs/common/decorators';
import * as bcrypt from 'bcrypt';
import {JwtService} from '@nestjs/jwt';
import { Users } from 'src/entities/user.entities';
import { User } from 'src/interface/user/user.interface';
import { CheckAuthenticationGuard } from 'src/guards/check-authentication/check-authentication.guard';
import { AdminAuthenticationGuard } from 'src/guards/admin-authentication/admin-authentication.guard';

@Controller('users')
@UseGuards(CheckAuthenticationGuard)
export class UsersController {
    constructor(private readonly usersService: UsersService, private readonly emailService: EmailService, private jwtService: JwtService){}


    // @Get('/get-role')
    // getRole(@Headers('authorization') jwt: string){
        
    // }

    @Get('/all-users')
    @UseGuards(AdminAuthenticationGuard)
    async getAllUsers(){
        try{
            const users= await this.usersService.getAllUsers();
            return {message: 'success', users};
        }
        catch(error){
            throw error;
        }
    }

    @Get('/user/:id')
    @UseGuards(AdminAuthenticationGuard)
    async getUser(@Param('id') userId: number){
        try{
            const user=await this.usersService.getUser(userId);
            return {message: 'success', user};
        }
        catch(error){
            throw error;
        }
    }

    // @Get('/getting-loggedIn-user')
    // gettingLoggedInUser(){
    //     const user= this.usersService.currentUser;
    //     return {message: 'success', user};
    // }

    @Put('/update-user')
    async updateUser(@Body() updatedUser: UpdatedUserDto, @Req() req: Request){
        try{
            const jwtToken=req.cookies.access_token;
            const res:any=this.jwtService.decode(jwtToken);
            const result=await this.usersService.updateUser(updatedUser, res.email);
            return {message: 'update successfully', result};
        }
        catch(error){
            throw error;
        }
    }

    @Put('/update-password')
    @UsePipes(ValidationPipe)
    async changePassword(@Body() changePasswordDto: ChangePasswordDto, @Req() req: Request){
        try{
            const jwtToken=req.cookies.access_token;
            const res:any=this.jwtService.decode(jwtToken);
            const saltOrRounds=await bcrypt.genSalt();
            const result=await this.usersService.resetPassword(res.email, await bcrypt.hash(changePasswordDto.password, saltOrRounds));
            return {message: 'password updated', result};
        }
        catch(error){
            throw error;
        }
    }

    @Get('/logout')
    async logout(@Req() req:Request, @Res() res: Response){
        try{
            const jwtToken=req.cookies.access_token;
            const result:any=this.jwtService.decode(jwtToken);
            await this.usersService.logout(result.email);
            res.clearCookie('access_token');
            res.json({message: 'logged out successfully'});
        }
        catch(error){
            throw error;
        }
    }

    @Delete('/delete/:userId')
    @UseGuards(AdminAuthenticationGuard)
    async deleteUser(@Param('userId', ParseIntPipe) userId: number){
        try{
           const result= await this.usersService.deleteUser(userId);
           return {message: 'deletion successfully', result};
        }
        catch(error){
            throw error;
        }
    }

}
