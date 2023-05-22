import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtExistsGuard implements CanActivate {
  constructor(private jwtService: JwtService){}

  canActivate(context: ExecutionContext){
    try{
      const request=context.switchToHttp().getRequest();
      const jwtToken=request.headers.authorization.split(' ')[1];
      const result=this.jwtService.verify(jwtToken, {secret: 'SecretKey'});
      return true;
    }
    catch{
      throw new UnauthorizedException();
    }
  }
}
