import { Controller, Get, Post , Body, Param, ParseIntPipe, UsePipes, ValidationPipe, Delete, Patch} from '@nestjs/common';
import { AppService } from './app.service';
import { CreateUserDto } from './dto/user.dto';
import { User } from './interface/user/user.interface';

@Controller()
export class AppController {


}
