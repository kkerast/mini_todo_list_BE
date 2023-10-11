import { ApiProperty } from "@nestjs/swagger";

export class HotdealDto {

@ApiProperty({
    example : 4,
    description : '0 : 게시글 작성하지 않은 캐시북, 1 : 게시글 작성한 캐시북'
})
public hotdealId : number;

@ApiProperty({
    example : '10p, 스타벅스',
    description : '0 : 게시글 작성하지 않은 캐시북, 1 : 게시글 작성한 캐시북'
})
public hotdealTitle : string;

@ApiProperty({
    example : 10,
    description : '포인트 차감'
})
public hotdealPrice : number;

@ApiProperty({
    example : 5,
    description : '핫딜 갯수'
})
public hotdealLimit : number;

@ApiProperty({
    example : '',
    description : '핫딜 이미지'
})
public hotdealImg : string;

@ApiProperty({
    example : '2023-07-04 14:00:00.000000',
    description : '핫딜 시작 시간'
})
public hotdealStartDate : Date;

@ApiProperty({
    example : '2023-07-04 18:00:00.000000',
    description : '핫딜 종료 시간'
})
public hotdealEndDate : Date;

}