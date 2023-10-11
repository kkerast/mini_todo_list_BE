import { PickType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class CommentTextDto extends PickType(CommentDto, ['commentText']) {}
