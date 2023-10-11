import { Column, Entity } from "typeorm";
import { PrimaryGeneratedColumn } from "typeorm";
@Entity('HotdealWinner')
export class HotdealWiner {

    @PrimaryGeneratedColumn()
    public hotdealWinnerId : number;
    
    @Column()
    public hotdealId : number;

    @Column()
    public hotdealWinnerPhone : string;

    @Column() 
    public hotdealApplyDate : Date;

    @Column()
    public userId : number;

}