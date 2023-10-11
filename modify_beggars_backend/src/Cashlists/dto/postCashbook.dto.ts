import { PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';
export class PostCashbookDto extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookName',
  'cashbookGoalValue',
] as const) {}
 