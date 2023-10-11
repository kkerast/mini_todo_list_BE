import { PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

export class CashbookCreateDto extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookName',
  'cashbookGoalValue',
  'userId',
  'cashListId',
] as const) {}
 