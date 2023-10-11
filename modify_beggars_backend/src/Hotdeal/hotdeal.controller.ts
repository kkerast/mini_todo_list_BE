import { 
    Controller, 
    Post, 
    Delete, 
    UseGuards, 
    Param, 
    Body, 
    Req ,
    Get, 
    Injectable, 
    UseInterceptors, 
    UploadedFile,
    ParseFilePipe,
    FileTypeValidator,
    HttpCode,
    Res
} from "@nestjs/common";
import { Express, Response } from 'express';
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { HotdealService } from "./hotdeal.service";
import { AccessAuthenticationGuard } from "src/Users/passport/jwt/access.guard";
import { Code, DataSource } from "typeorm";
import { HotdealApplyDto } from "./dto/hotdealApply.dto";
import { HotdealByIdDto } from "./dto/hotdealById.dto";
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { FileInterceptor } from "@nestjs/platform-express";
import { HotdealAddDto } from "./dto/hotdealAdd.dto";
import { ApiConsumes } from "@nestjs/swagger";

@ApiTags('핫딜 API')
@Controller('api/hotdeal')
export class HotdealController {
    constructor(
        private hotdealService : HotdealService,
        private dataSource: DataSource
    ){} 

    @Post(':hotDealId')
    @UseGuards(AccessAuthenticationGuard)
    @HttpCode(201)
    @ApiOperation({
        summary : '핫딜 등록'
    })
    async hotdealApply(hotdealApplyDto : HotdealApplyDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let hotdealByIdDto = new HotdealByIdDto()
            hotdealByIdDto = {
                hotdealId : hotdealApplyDto.hotdealId
            }
            await this.hotdealService.readInventory(hotdealByIdDto, queryRunner)
            await this.hotdealService.minusInventory(hotdealByIdDto,queryRunner)
            await this.hotdealService.registWinner(hotdealApplyDto,queryRunner)
            return `신청이 완료됐습니다`
        } catch(e) {
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }

    }
    
    @Post()
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({
        summary : '핫딜 추가(관리자)'
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    @HttpCode(201)
    async hotdealAdd(
        @Req() req : any,  
        @Body() hotdealAddDto : HotdealAddDto,
        @UploadedFile(  
        new ParseFilePipe({
            validators: [
                new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
            ],
            fileIsRequired: false,
            }),
        )
        file : Express.Multer.File,
        @Res() res: Response,
    ) { 
        try {
            // const { user } = req
            // if(user.userAuth!==1) {
            //     throw new HttpException('관리자가 아닙니다', HttpStatus.BAD_REQUEST)
            // }
            console.log(file)
            const { location } = file;
            hotdealAddDto.hotdealImg = location
            await this.hotdealService.addHotdeal(hotdealAddDto)
            return res.status(201).send('완료')
        } catch(e) {
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get('/')
    @ApiOperation({
        summary : '핫딜 리스트'
    })
    async hotdealList() {
        try {
            return await this.hotdealService.getHotdealList()
        } catch(e) {
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Delete('/')
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({
        summary : '핫딜 삭제'
    })
    async hotdealDelete(@Req() req : any, hotdealByIdDto : HotdealByIdDto ) {
        try {
            const { user } = req
            if(user.userAuth!==1) {
                throw new HttpException('관리자가 아닌 유저가 접근했습니다', HttpStatus.BAD_REQUEST)
            }
            await this.hotdealService.hotdealDelete(hotdealByIdDto)
            return '삭제완료'
        } catch(e) {
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }


}