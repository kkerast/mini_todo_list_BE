import { ApiProperty } from '@nestjs/swagger';
import { CashList } from 'src/Cashlists/entity/cashList.entity';
import { Cashbook } from 'src/Cashlists/entity/cashbook.entity';
import { Board } from 'src/Boards/entity/board.entity';
import { Comment } from 'src/Comments/entity/comment.entity';
import { Like } from 'src/Comments/entity/like.entity';
import { IsOptional, MaxLength } from 'class-validator';

export class UserDto {
  public userId: number;

  @ApiProperty({
    example: 'rlatmdcjf',
    description: '사용자 아이디',
  })
  @MaxLength(20)
  public userName: string;

  @ApiProperty({
    example: '가나다라',
    description: '사용자 닉네임',
  })
  @MaxLength(20)
  public userNickname: string;

  @ApiProperty({
    example: 'qwe123456',
    description: '유저 비밀번호',
  })
  @MaxLength(20)
  public userPwd: string;

  @ApiProperty({
    example: '0',
    description: '일반 회원',
  })
  public userAuth: number;

  public userLoginType: string;

  public userType: number;

  @ApiProperty({
    example: '0',
    description: '일반 로그인',
  })
  public userPoint: number;

  @ApiProperty({
    example: 'sdfsfdgd.jpg',
    description: '사용자 이미지',
    type: 'string',
    format: 'binary',
  })
  @IsOptional()
  public userImage: string;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '회원가입 날짜',
  })
  public userCreatedAt: Date;

  @ApiProperty({
    example: '2023-07-04 04:49:37.783151',
    description: '회원정보 업데이트 날짜',
  })
  public userUpdatedAt: Date;

  public cashlists?: CashList[];

  public cashbooks?: Cashbook[];

  public boards?: Board[];

  public comments?: Comment[];

  public likes?: Like[];
}
