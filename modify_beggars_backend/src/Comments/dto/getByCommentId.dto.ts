import { PickType } from '@nestjs/swagger';
import { CommentDto } from './comment.dto';

export class GetByCommentIdDto extends PickType(CommentDto, ['commentId']) {}
