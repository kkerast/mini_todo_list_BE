import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

export class GetCategory extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookGoalValue',
  'cashbookNowValue',
] as const) {}
 