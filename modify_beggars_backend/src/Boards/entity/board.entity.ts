import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import User from 'src/Users/entity/user.entity';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  OneToOne,
  BeforeInsert,
  BeforeUpdate,
} from 'typeorm';

@Entity('Board')
export class Board {
  @PrimaryGeneratedColumn()
  public boardId: number;
 
  @Column()
  public boardName: string;

  @Column()
  public boardText: string;

  @Column()
  public boardTypes: number;

  @Column({ type: 'timestamp' })
  public boardCreatedAt: Date;

  @Column({ type: 'timestamp' })
  public boardUpdatedAt: Date;

  @ManyToOne(() => User, (user: User) => user.userId)
  @JoinColumn({ name: 'userId' })
  public userId: User;

  @OneToMany(() => Comment, (comment: Comment) => comment.boardId, {
    cascade: true,
  })
  public comments?: Comment[];

  @OneToOne(() => Cashbook, (cashbook: Cashbook) => cashbook.cashbookId, {
    onDelete :'CASCADE'
  }) 
  @JoinColumn({ name: 'cashbookId' })
  public cashbookId: Cashbook;

  @BeforeInsert()
  updateCreatedAt() {
    this.boardCreatedAt = new Date();
  }

  @BeforeUpdate()
  updateUpdatedAt() {
    this.boardUpdatedAt = new Date();
  }
}
