import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
@Entity('Hotdeal')
export class Hotdeal {

    @PrimaryGeneratedColumn()
    public hotdealId : number;

    @Column()
    public hotdealTitle : string;

    @Column()
    public hotdealPrice : number;

    @Column()
    public hotdealLimit : number;

    @Column()
    public hotdealImg : string;

    @Column()
    public hotdealStartDate : Date;

    @Column()
    public hotdealEndDate : Date;


}