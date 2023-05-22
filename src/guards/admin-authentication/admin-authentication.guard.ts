import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { Users } from 'src/entities/user.entities';
import { UsersService } from 'src/users/users/users.service';

@Injectable()
export class AdminAuthenticationGuard implements CanActivate {

  constructor(private readonly usersService: UsersService, private jwtService: JwtService){}

  canActivate(context: ExecutionContext){
    try{
      const request=context.switchToHttp().getRequest();
      if(!request.cookies.access_token){
        throw new UnauthorizedException();
      }
      const jwtToken=request.cookies.access_token;
      const res=this.jwtService.verify(jwtToken, {secret: 'SecretKey'});
      if(res.role!=1){
          throw new UnauthorizedException();
      }
      return true;
    }
    catch{
        throw new UnauthorizedException();
    }
  }

}
