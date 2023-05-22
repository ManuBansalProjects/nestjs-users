import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Users } from 'src/entities/user.entities';
import { UsersService } from 'src/users/users/users.service';

@Injectable()
export class AdminAuthenticationGuard implements CanActivate {

  constructor(private readonly usersService: UsersService){}

  canActivate(context: ExecutionContext){
    try{
      if(this.usersService.currentUser && this.usersService.currentUser.role!=1){
          throw new UnauthorizedException();
      }
      return true;
    }
    catch(error){
        throw error;
    }
  }

}
