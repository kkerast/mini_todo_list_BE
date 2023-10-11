import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/Users/entity/user.entity';
import { Board } from 'src/Boards/entity/board.entity';
import { Like } from '../entity/like.entity';

export class CommentDto {
  @ApiProperty({
    example: 1,
  })
  public commentId: number;

  @ApiProperty({
    example: '넘 많이쓴거 아님?',
  })
  public commentText: string;

  @ApiProperty({})
  public commentCreatedAt: Date;

  public userId: User;

  public boardId: Board;

  public likes?: Like[];
}
