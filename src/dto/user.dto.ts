import { IsEmail, IsNotEmpty, IsOptional, MinLength } from "class-validator";

export class CreateUserDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(8)
  password: string;  
}

export class ForgotpasswordDto{
  @IsNotEmpty()
  @IsEmail()
  email:string;
}

export class EmailDetailsDto{
  @IsNotEmpty()
  @IsEmail()
  email:string;

  @IsNotEmpty()
  text:string;
}

export class LoginUserDto{
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @MinLength(3)
  password: string;
}



export class ChangePasswordDto{
  @IsNotEmpty()
  @MinLength(8)
  password: string;
}

export class CurrentuserDto{
  id: number;
  name: string;
  email: string;
  password: string;
  jwt: string
  role: number;
  isactive: number;
}

export class UpdatedUserDto{
  @IsNotEmpty()
  @MinLength(3)
  @IsOptional()
  name: string
}