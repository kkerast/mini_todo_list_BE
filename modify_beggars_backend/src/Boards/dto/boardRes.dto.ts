import { ApiProperty, PickType } from '@nestjs/swagger';
import { BoardDto } from './board.dto';
import { UserDto } from 'src/Users/dto/user.dto';
import { CashbookDto } from 'src/Cashlists/dto/cashbook.dto';
import { IsNotEmpty } from 'class-validator';

class BoardUserDto extends PickType(UserDto, ['userName', 'userNickname']) {}

class BoardCashbookDto extends PickType(CashbookDto, [
  'cashbookId',
  'cashbookCategory',
  'cashbookName',
  'cashbookNowValue',
  'cashbookGoalValue',
  'cashbookCreatedAt',
]) {}

export class BoardResDto extends PickType(BoardDto, [
  'boardId',
  'boardName',
  'boardText',
  'boardTypes',
  'boardCreatedAt',
]) {
  @ApiProperty({
    type: BoardUserDto,
    example: {
      userName: 'dfgdfg',
      userNickname: 'fgdhgfhfgh',
    },
  })
  public userId: BoardUserDto;

  @ApiProperty({
    type: BoardCashbookDto,
    example: {
      cashbookId: 188,
      cashbookCategory: '식비', 
      cashbookName: 'asdsdfsdf',
      cashbookNowValue: 0,
      cashbookGoalValue: 3000,
      cashbookCreatedAt: '2023-07-11T16:36:01.000Z',
    },
  })
  public cashbookId: BoardCashbookDto;

  @ApiProperty({ 
    type: Number,
    example : 2
  })
  @IsNotEmpty()
  public pageNum: number;

  @ApiProperty({
    type: Boolean,
    example : true
  })
  @IsNotEmpty()
  public hasNextPage: boolean;

}
