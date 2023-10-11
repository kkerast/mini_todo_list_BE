import { ApiProperty, PickType } from '@nestjs/swagger';
import { Board } from 'src/Boards/entity/board.entity';
import { User } from 'src/Users/entity/user.entity';
import { CommentDto } from './comment.dto';
import { GetByBoardIdDto } from 'src/Boards/dto/getByBoardId.dto';

export class PostCommentDto extends PickType(CommentDto, [
  'userId',
  'commentText'
]) {
  @ApiProperty({})
  public boardId: GetByBoardIdDto;
}
