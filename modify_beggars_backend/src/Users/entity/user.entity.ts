import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';
import { Exclude } from 'class-transformer';
import { Board } from 'src/Boards/entity/board.entity';
import { CashList } from 'src/Cashlists/entity/cashList.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { Like } from 'src/Comments/entity/like.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('User')
export class User {
  @PrimaryGeneratedColumn()
  public userId: number;

  @Column({ unique: true })
  public userName: string;

  @Column({ unique: true })
  public userNickname: string;

  @Column({ nullable: true })
  @Exclude()
  public userPwd: string;

  @Column({ default: 0 })
  public userAuth: number;

  @Column({ default: 'normal' })
  public userLoginType: string;

  @Column({ default: 0 })
  public userType: number;

  @Column({ nullable: true, default: 0 })
  public userPoint: number;

  @Column({ nullable: true })
  public userImage: string;

  @Column({ type: 'timestamp' })
  public userCreatedAt: Date;

  @Column({ type: 'timestamp' })
  public userUpdatedAt: Date;

  @OneToMany(() => CashList, (cashlist: CashList) => cashlist.userId, {
    cascade: true,
  })
  public cashlists?: CashList[];

  @OneToMany(() => Cashbook, (cashbook: Cashbook) => cashbook.userId, {
    cascade: true,
  })
  public cashbooks?: Cashbook[];

  @OneToMany(() => Board, (board: Board) => board.userId, {
    cascade: true,
  })
  public boards?: Board[];

  @OneToMany(() => Comment, (comment: Comment) => comment.userId, {
    cascade: true,
  })
  public comments?: Comment[];

  @OneToMany(() => Like, (like: Like) => like.userId, {
    cascade: true,
  })
  public likes?: Like[];

  @BeforeInsert()
  updateCreatedAt() {
    this.userCreatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.userUpdatedAt = new Date();
  }
}

export default User;
