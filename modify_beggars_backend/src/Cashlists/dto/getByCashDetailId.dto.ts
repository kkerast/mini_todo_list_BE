import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashDetailDto } from './cashbook.dto';

export class GetByCashDetailIdDto extends PickType(CashDetailDto, [
  'cashDetailId',
] as const) {}
 