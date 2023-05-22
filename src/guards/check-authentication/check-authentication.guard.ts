import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';
import { UsersService } from 'src/users/users/users.service';

@Injectable()
export class CheckAuthenticationGuard implements CanActivate {
  constructor(private jwtService: JwtService, private usersService: UsersService){}

  canActivate(context: ExecutionContext){
    try{
      const request=context.switchToHttp().getRequest();
      if(!request.cookies.access_token){
        throw new UnauthorizedException();
      }
      const jwtToken=request.cookies.access_token
      const result=this.jwtService.verify(jwtToken, {secret: 'SecretKey'});
      return true;
    }
    catch{
      throw new UnauthorizedException();
    }
  }

}
