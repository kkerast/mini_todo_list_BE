import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

export class GetByCashbookIdDto extends PickType(CashbookDto, [
  'cashbookId',
] as const) {}
 