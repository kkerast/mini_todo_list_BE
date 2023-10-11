import { ApiProperty, PickType } from '@nestjs/swagger';
import { BoardDto } from './board.dto';

export class PostBoardDto extends PickType(BoardDto, [
  'boardTypes',
  'boardName',
  'boardText',
  'userId',
  'cashbookId',
]) {}
 