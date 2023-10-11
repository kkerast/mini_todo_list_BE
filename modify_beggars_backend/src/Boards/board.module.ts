import { Module, Controller } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from 'src/Users/entity/user.entity';
import { Board } from 'src/Boards/entity/board.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import { PassportModule } from '@nestjs/passport';
import { BoardController } from 'src/Boards/board.controller';
import { BoardService } from 'src/Boards/board.service';
import { UserModule } from 'src/Users/user.module';
import { CashbookModule } from 'src/Cashlists/cashbook.module';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { CashDetail } from 'src/Cashlists/entity/cashDetail.entity';
import { CommentService } from 'src/Comments/comment.service';
import { Like } from 'src/Comments/entity/like.entity';
import { AuthService } from 'src/Users/service/oauth2.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Board,
      Comment,
      Cashbook,
      CashDetail,
      Like,
    ]),
    PassportModule,
    UserModule,
    CashbookModule,
  ],
  controllers: [BoardController],
  providers: [BoardService, CommentService, AuthService, JwtService],
  exports: [BoardService], 
}) 
export class BoardModule {}
