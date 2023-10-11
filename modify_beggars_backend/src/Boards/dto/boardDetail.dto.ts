import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PickType } from '@nestjs/swagger';
import { BoardDto } from './board.dto';

export class BoardDetailDTO extends PickType(BoardDto, ['boardId']) {}
