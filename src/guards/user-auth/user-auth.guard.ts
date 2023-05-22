import { CanActivate, ExecutionContext, Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { LoginUserDto } from 'src/dto/user.dto';
import { UsersService } from 'src/users/users/users.service';

@Injectable()
export class UserAuthGuard implements CanActivate {

  constructor(private usersService: UsersService){}

  async canActivate(context: ExecutionContext){
    try{
      const request=context.switchToHttp().getRequest();

      const userCredentials: LoginUserDto=request.body;
      const isValidated=await this.usersService.validatingUserCredentials(userCredentials);
      if(!isValidated){
        throw new UnauthorizedException('Invalid Credentials'); 
      }
      if(!this.usersService.currentUser.isactive){
        throw new UnauthorizedException('Your Account Is Blocked')
      }
      return isValidated;
    }
    catch(error){
      throw error;
    }
  }

}
