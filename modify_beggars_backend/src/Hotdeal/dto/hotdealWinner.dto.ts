import {ApiProperty } from "@nestjs/swagger";


export class HotdealWinnerDto {

    @ApiProperty({
        example : 4,
        description : '핫딜 당첨자 number'
    })
    public hotdealWinnerId : number;
    
    @ApiProperty({
        example : 2,
        description : '핫딜 번호'
    })
    public hotdealId : number;

    @ApiProperty({
        example : 2,
        description : '유저 번호'
    })
    public userId : number;

    @ApiProperty({
        example : '01034345465',
        description : '핫딜 당첨자 번호'
    })
    public hotdealWinnerPhone : string;

    @ApiProperty({
        example : '2023-07-18',
        description : '핫딜 지원 시간'
    })
    public hotdealApplyDate : Date;


}