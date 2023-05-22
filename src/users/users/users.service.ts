import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import {InsertResult, Repository} from 'typeorm';
import {InjectRepository} from '@nestjs/typeorm';
import { Users } from 'src/entities/user.entities';
import { CreateUserDto, CurrentuserDto, LoginUserDto, UpdatedUserDto } from 'src/dto/user.dto';
import { create } from 'domain';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt/dist';
import { User } from 'src/interface/user/user.interface';




@Injectable()
export class UsersService {
    currentUser: CurrentuserDto;

    constructor(@InjectRepository(Users) private readonly userRepository: Repository<Users>, private jwtService: JwtService){}

    async registration(createUser: CreateUserDto): Promise<InsertResult>{
        try{
            const newUser=this.userRepository.create(createUser);
            const result= await this.userRepository.insert(newUser);
            return result;
        }
        catch(error){
            throw error;
        }
    }

    async userAlreadyExists(email: string): Promise<boolean>{
        try{
            const user=await this.userRepository.findBy({email: email});
            return user.length>0;
        }
        catch(error){
            throw error;
        }
    }

    async validatingUserCredentials(loginUserDto: LoginUserDto): Promise<boolean>{
        try{
            const user=await this.userRepository.findOne({where:{email: loginUserDto.email}});
            if( !( user && bcrypt.compareSync(loginUserDto.password, user.password) ) ){
                return false;
            }
            this.currentUser=user;
            return true;
        }
        catch(error){
            throw error;
        }
    }

    async generateToken(tokenDetails:any): Promise<string>{
        try{
            const jwtToken=this.jwtService.sign(tokenDetails);
            return jwtToken;
        }
        catch(error){
            throw error;
        }
    }

    async saveJwtToDatabase(jwtToken: string){
        try{
            this.currentUser.jwt=jwtToken;
            await this.userRepository.save(this.currentUser);
        }
        catch(error){
            throw error;
        }
    }

    async resetPassword(email: string, password: string): Promise<Users>{
        try{
            let user=await this.userRepository.findOne({ where: {email: email}});
            user.password=password;
            const result=await this.userRepository.save(user);
            return result;
            // this.changeRole('bansal.manu444@gmail.com', 1); // to do ->implement
        }
        catch(error){
            throw error;
        }
    }

    async updatePassword(password: string): Promise<Users>{
        try{
            this.currentUser.password=password;
            const result=await this.userRepository.save(this.currentUser);
            return result;
        }
        catch(error){
            throw error;
        }
    }

    async changeRole(email: string, role: number){
        try{
            let user=await this.userRepository.findOne({ where: {email: email}});
            if(user.role !=1){
                user.role=role;
                const result=await this.userRepository.save(user);
                console.log(result);
            }
            else{
                throw new BadRequestException();
            }
        }
        catch(error){
            throw error;
        }
    }
    
    async getAllUsers(): Promise<Users[]>{
        try{
            return await this.userRepository.find({select:{name: true, email:true, role:true, isactive:true}});
        }
        catch(error){
            throw error;
        }
    }

    async getUser(userId : number): Promise<Users>{
        try{
            const user=await this.userRepository.findOne({where:{id: userId} , select:{name: true, email:true, role:true, isactive:true}});
            if(user){
                return user;
            }
            else { 
                throw new BadRequestException();
            }
        }
        catch(error){
            throw error;
        }
    }

    async updateUser(updatedUser: UpdatedUserDto): Promise<Users>{
        try{
            this.currentUser.name=updatedUser.name;
            const result=await this.userRepository.save(this.currentUser);
            return result;
        }
        catch(error){
            throw error;
        }
    }

    async logout(){
        try{
            this.currentUser.jwt=null;
            const result=await this.userRepository.save(this.currentUser);
            this.currentUser=undefined;
        }
        catch(error){
            throw error;
        }
    }

    async deleteUser(userId: number): Promise<Users>{
        try{
            const user=await this.userRepository.findOne({where:{id:userId}});
            if(user && user.role != 1){
                user.isactive=0;
                const result=await this.userRepository.save(user);
                return result;
            }
            else{
                throw new BadRequestException();
            }
        }
        catch(error){
            throw error;
        }
    }
}
