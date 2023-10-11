import { Controller, Post, Delete, Param, Req, Body, HttpStatus, HttpException, UseGuards } from '@nestjs/common';
import { Comment } from './entity/comment.entity';
import { CommentService } from './comment.service';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { CreateFail } from 'src/Utils/exception.service';
import { GetByCommentIdDto } from './dto/getByCommentId.dto';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';

@Controller('api/like')
@ApiTags('댓글/좋아요 API') 
export class LikeController {
  constructor(private readonly commentService: CommentService) {}

  @Post(':commentId')
  @UseGuards(AccessAuthenticationGuard)
  @ApiOperation({ 
    summary: '댓글 입력',
    description: '댓글 입력, 포인트 1점 기입', 
  })
  async postLike(@Param() getByCommentIdDto: GetByCommentIdDto, @Req() req: any) {
    try {
      console.log('dfgdfgdfg')
      let { user } = req;
      await this.commentService.postLike(user, getByCommentIdDto);
      return `좋아요 완료`;
    } catch(e) {
      console.log(e)
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    } 
  }
}
