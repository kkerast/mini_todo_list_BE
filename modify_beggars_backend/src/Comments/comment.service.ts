import { Injectable } from '@nestjs/common';
import { QueryRunner, Repository } from 'typeorm';
import { Comment } from './entity/comment.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { PostCommentDto } from './dto/postComment.dto';
import User from 'src/Users/entity/user.entity';
import { UserService } from 'src/Users/service/user.service';
import { EntityManager } from 'typeorm';
import { Like } from './entity/like.entity';
import { GetByUserIdDto } from 'src/Users/dto/getByUserId.dto';
import { GetByCommentIdDto } from './dto/getByCommentId.dto';
import { CreateFail, DeleteFail, ReadFail } from 'src/Utils/exception.service';

@Injectable()
export class CommentService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentEntity: Repository<Comment>,

    @InjectRepository(Like)
    private readonly likeEntity: Repository<Like>,

    private readonly userService: UserService
  ) {}

  async postComment(postCommentDto: PostCommentDto, queryRunner : QueryRunner) {
    try {
      const query = this.commentEntity.create(postCommentDto);
      await queryRunner.manager.save(query)
    } catch(e) { 
      throw new CreateFail(e.stack)
    }
  }

  async deleteComment(getByCommentIdDto: GetByCommentIdDto, getByUserIdDto: GetByUserIdDto) {
    try {
      return await this.commentEntity
        .createQueryBuilder('comment')
        .delete()
        .where('commentId=:commentId', {
          commentId: getByCommentIdDto.commentId,
        })
        .andWhere('userId=:userId', { userId : getByUserIdDto.userId })
        .execute();
    } catch(e) { 
      throw new DeleteFail(e.stack)
    }
  }

  async postLike(getByUserIdDto: GetByUserIdDto, getByCommentIdDto: GetByCommentIdDto) {
    try {
      let query = await this.likeEntity
        .createQueryBuilder('like')
        .select()
        .where('userId=:userId', { userId : getByUserIdDto.userId })
        .andWhere('commentId=:commentId', { commentId : getByCommentIdDto.commentId})
        .getOne();
      if (!query) { 
        query = this.likeEntity.create({
          userId: getByUserIdDto,
          commentId: getByCommentIdDto
        });
      } else {
        query.likeCheck === 1 ? (query.likeCheck = 0) : (query.likeCheck = 1);
      } 
      return this.likeEntity.save(query);
    } catch(e) {
      console.log(e)
      throw new CreateFail(e.stack)
    }
  }

  async getLike(commentId: Comment) {
    try {
      const result: number = await this.likeEntity.query(
        `SELECT count(*) FROM Like
              WHERE likeCheck=1
              AND WHERE commentId = ?`,
        [commentId],
      );
      return result;
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  async getLikeList(commentId: number[]) {
    try {
      const query = await this.likeEntity
        .createQueryBuilder('like')
        .select('like.commentId', 'commentId')
        .addSelect('COUNT(like.likeId)', 'likeCount')
        .where('like.commentId IN (:...commentId)', { commentId })
        .andWhere('like.likeCheck=1')
        .groupBy('like.commentId')
        .getRawMany();

      const result = {};
      for (let i = 0; query.length > i; i++) {
        result[query[i].commentId] = query[i].likeCount;
      }
      return result;
    } catch(e) {
      throw new ReadFail(e.stack)  
    }
  }
  async getLikeCheck(commentId: number[], userId: number) {
    try {
      const query = await this.likeEntity
        .createQueryBuilder('like')
        .select('like.commentId', 'commentId')
        .addSelect('like.likeCheck', 'likeCheck')
        .where('like.userId=:userId', { userId })
        .andWhere('like.commentId IN (:...commentId)', { commentId })
        .andWhere('like.likeCheck=1')
        .getRawMany();

      const result = {};
      for (let i = 0; query.length > i; i++) {
        result[query[i].commentId] = query[i].likeCheck;
      }
      return result;
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }
}
