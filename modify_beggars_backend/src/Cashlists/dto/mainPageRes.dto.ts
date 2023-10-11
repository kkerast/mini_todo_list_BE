import { ApiProperty, PickType } from '@nestjs/swagger';
import { CashbookDto } from './cashbook.dto';

class GroupByCategoryDto extends PickType(CashbookDto, [
  'cashbookCategory',
  'cashbookNowValue',
  'cashbookGoalValue',
] as const) {}
class CashbookTotalDto extends PickType(CashbookDto, [
  'cashbookNowValue',
  'cashbookGoalValue',
] as const) {}

class MainPageResDto {
  @ApiProperty({
    example: 14,
    description: '가입 후 몇 일 째 되는날',
  })
  public signupDay: number;

  @ApiProperty({
    example: { '2022-04-01': 0, '2022-04-02': 1 },
    description: 'null : 없는날짜,  0 : 실패,  1 : 부분성공, 2: 완전성공',
  })
  public twoweek: object;

  @ApiProperty({
    example: { 
      cashCategory: '식비',
      cashbookNowValue: 5000,
      cashbookGoalValue: 8000,
    },
    description: '카테고리 대분류 group by',
  })
  public groupByCategory: GroupByCategoryDto[];

  @ApiProperty({
    example: { cashbookNowValue: 5000, cashbookGoalValue: 8000 },
    description: '카테고리 대분류 group by',
  })
  public total: CashbookTotalDto;
}

export { MainPageResDto as MainPageDto };
 