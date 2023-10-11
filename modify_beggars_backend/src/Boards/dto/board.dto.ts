import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/Users/entity/user.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { IsNotEmpty } from 'class-validator';

export class BoardDto {
  @ApiProperty({
    example: 14,
    description: '게시판 번호',
  })
  public boardId: number;

  @ApiProperty({
    example: '오식예 ( 오늘의 식단 예산이라는 뜻 )',
    description: '게시판 제목',
  })
  @IsNotEmpty()
  public boardName: string;

  @ApiProperty({
    example: '아 오늘 하루 넘넘 힘들었다. 이 돈 가지고 언제까지 버텨야 하지?',
    description: '게시판 텍스트',
  })
  @IsNotEmpty()
  public boardText: string;

  public boardTypes: number;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '글 쓴 시간',
  })
  @IsNotEmpty()
  public boardCreatedAt: Date;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '글 수정 시간 ( 수정이 없으므로 사용하지 않는 항목 )',
  })
  public boardUpdatedAt: Date;

  @IsNotEmpty()
  public userId: User;

  @IsNotEmpty()
  public cashbookId: Cashbook;
}
