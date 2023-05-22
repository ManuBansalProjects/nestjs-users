import { CanActivate, ExecutionContext, Injectable, BadRequestException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { CreateUserDto } from 'src/dto/user.dto';
import { UsersService } from 'src/users/users/users.service';

@Injectable()
export class UserRegistrationGuard implements CanActivate {

  constructor(private readonly usersService: UsersService){}

  async canActivate( context: ExecutionContext) {
    try{
      const request=context.switchToHttp().getRequest();
      const createUser: CreateUserDto=request.body;
      const isExist=await this.usersService.userAlreadyExists(createUser.email);
      if(isExist){
          throw new BadRequestException('Email already exists');
      }
      return true;
    }
    catch(error){
      throw error;
    }
  }
  
}
