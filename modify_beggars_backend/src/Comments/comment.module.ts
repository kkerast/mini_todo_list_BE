import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/Users/entity/user.entity';
import { Board } from 'src/Boards/entity/board.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import { Like } from './entity/like.entity';
import { PassportModule } from '@nestjs/passport';
import { BoardController } from 'src/Boards/board.controller';
import { BoardService } from 'src/Boards/board.service';
import { CommentService } from './comment.service';
import { LikeController } from './like.controller';
import { CommentController } from './comment.controller';
import { UserService } from 'src/Users/service/user.service';
import { AuthService } from 'src/Users/service/oauth2.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, Board, Comment, Like]),
    PassportModule,
  ],
  controllers: [CommentController, LikeController],
  providers: [CommentService, UserService], 
  exports: [CommentService],
})
export class CommentModule {}
