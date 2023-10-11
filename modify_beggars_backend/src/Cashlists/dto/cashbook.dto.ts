import User from 'src/Users/entity/user.entity';
import { CashDetail } from '../entity/cashDetail.entity';
import { Cashbook } from '../entity/cashbook.entity';
import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';
import { CashList } from '../entity/cashList.entity';

class CashbookDto {
  @ApiProperty({
    example: 14,
    description: '캐시북 번호',
  })
  public cashbookId: number;

  @ApiProperty({
    example: '식비',
    description: '캐시북 카테고리',
  })
  @IsNotEmpty()
  public cashbookCategory: string;

  @ApiProperty({
    example: '중식',
    description: '캐시북 카테고리 소분류',
  })
  public cashbookName: string;

  @ApiProperty({
    example: 2000,
    description: '현재 소비된 금액',
  })
  public cashbookNowValue: number;

  @ApiProperty({
    example: 4000,
    description: '목표 소비 금액',
  })
  public cashbookGoalValue: number;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '캐시북 생성 날짜. 디폴트 당일 00시',
  })
  public cashbookCreatedAt: Date;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '캐시북 수정',
  })
  public cashbookUpdatedAt: Date;

  @ApiProperty({
    example: 4,
    description: '유저 아이디',
  })
  public userId: User;
 
  @ApiProperty({
    example: [
      {
        cashDetailId: 4,
        cashDetailText: '마라탕350g',
        cashDetailValue: 5000,
      },
    ],
    description: '캐시 디테일',
  })
  public detail?: CashDetail[];

  @ApiProperty({
    example: 2,
    description: '캐시 프레임 아이디',
  })
  public cashListId: CashList;
}

class CashListDto {
  @ApiProperty({
    example: 14,
    description: '캐시 리스트 번호',
  })
  public cashListId: number;

  @ApiProperty({
    example: '식비',
    description: '가계부 프레임 카테고리',
  })
  @IsNotEmpty()
  public cashCategory: string;

  @ApiProperty({
    example: '식비',
    description: '가계부 프레임 이름',
  })
  public cashName: string;

  @ApiProperty({
    example: 5000,
    description: '가계부 프레임 목표',
  })
  @IsNotEmpty()
  public cashListGoalValue: number;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '가계부 프레임 생성일',
  })
  public cashListCreatedAt: Date;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '가계부 프레임 수정일',
  })
  public cashListUpdatedAt: Date;

  public userId: User;
}

class CashDetailDto {
  @ApiProperty({
    example: 14,
    description: '캐시 디테일 번호',
  })
  public cashDetailId: number;

  @ApiProperty({
    example: '짬뽕',
    description: '소비 상세 정보',
  })
  @IsNotEmpty()
  public cashDetailText: string;

  @ApiProperty({
    example: 5000,
    description: '소비 상세 가격',
  })
  @IsNotEmpty()
  public cashDetailValue: number;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '가계부 디테일 생성일',
  })
  public cashDetailCreatedAt: Date;

  public cashbookId: Cashbook;
}

class CashActivityDto {}

export { CashbookDto, CashListDto, CashDetailDto, CashActivityDto };
