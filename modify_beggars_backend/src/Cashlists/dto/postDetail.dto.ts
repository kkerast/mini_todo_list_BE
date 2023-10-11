import { PickType } from '@nestjs/swagger';
import { CashDetailDto } from './cashbook.dto';

export class PostDetailDto extends PickType(CashDetailDto, [
  'cashbookId',
  'cashDetailText',
  'cashDetailValue',
] as const) {}
 