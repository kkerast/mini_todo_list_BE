import User from 'src/Users/entity/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  ManyToOne,
  JoinColumn,
  BeforeInsert,
  BeforeUpdate,
  OneToMany,
} from 'typeorm';
import { Cashbook } from './cashbook.entity';

@Entity('CashList')
export class CashList {
  @PrimaryGeneratedColumn()
  public cashListId: number; 

  @Column()
  public cashCategory: string;

  @Column()
  public cashName: string;

  @Column()
  public cashListGoalValue: number;

  @Column({ type: 'timestamp' })
  public cashListCreatedAt: Date;

  @Column({ type: 'timestamp' })
  public cashListUpdatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.userId)
  @JoinColumn({ name: 'userId' })
  public userId: User;

  @OneToMany(() => Cashbook, (cashbook: Cashbook) => cashbook.cashListId)
  public cashbook?: Cashbook[];

  @BeforeInsert()
  updateCreatedAt() {
    this.cashListCreatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.cashListUpdatedAt = new Date();
  }
}
