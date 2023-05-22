import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Users{
    @PrimaryGeneratedColumn()
    id: number;

    @Column({nullable: false})
    name: string;

    @Column({nullable: false})            
    email: string;

    @Column({nullable: false})
    password: string;

    @Column()
    jwt: string;

    @Column()
    role: number;

    @Column()
    isactive: number;
}