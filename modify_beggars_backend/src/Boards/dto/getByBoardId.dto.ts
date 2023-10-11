import { PickType } from '@nestjs/swagger';
import { BoardDto } from './board.dto';

export class GetByBoardIdDto extends PickType(BoardDto, ['boardId']) {}
 