import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  ManyToOne, 
  JoinColumn,
  BeforeInsert,
} from 'typeorm';
import { Comment } from './comment.entity';
import User from 'src/Users/entity/user.entity';

@Entity('Like')
export class Like {
  @PrimaryGeneratedColumn()
  public likeId: string;

  @ManyToOne(() => Comment, (comment: Comment) => comment.commentId, {
    onDelete: 'CASCADE',
  }) 
  @JoinColumn({ name: 'commentId' })
  public commentId: Comment;

  @ManyToOne(() => User, (user: User) => user.userId)
  @JoinColumn({ name: 'userId' })
  public userId: User;

  @Column({ default: 1 })
  public likeCheck: number;

  @CreateDateColumn({ type: 'timestamp' })
  public likeCreatedAt: Date;

  @BeforeInsert()
  updateCreatedAt() {
    this.likeCreatedAt = new Date();
  }
}
