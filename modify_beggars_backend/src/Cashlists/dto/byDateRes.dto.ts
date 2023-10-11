import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

export class ByDateResDto extends PickType(CashbookDto, [
  'cashbookId',
  'cashbookName',
  'cashbookCategory',
  'cashbookNowValue',
  'cashbookGoalValue',
] as const) {
  @ApiProperty({
    example: 0,
    description: '0 : 게시글 작성하지 않은 캐시북, 1 : 게시글 작성한 캐시북',
  })
  public writeCheck: Number;
}
 