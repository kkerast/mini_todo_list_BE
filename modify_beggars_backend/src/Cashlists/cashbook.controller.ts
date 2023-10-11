import { Controller,Post,Req, Body, HttpCode, UseGuards, Get, Query, Delete, Param, Put, ConsoleLogger, UseFilters} from '@nestjs/common';
import { CashbookService } from './cashbook.service';
import { PostDetailDto } from './dto/postDetail.dto';
import { Cashbook } from './entity/cashbook.entity';
import { AccessAuthenticationGuard } from 'src/Users/passport/jwt/access.guard';
import { UserService } from 'src/Users/service/user.service';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { FrameDto } from './dto/frame.dto';
//import * as moment from 'moment-timezone';
const moment = require('moment-timezone')
import { DataSource } from 'typeorm';
import { ApiTags, ApiOperation, ApiResponse, ApiProperty, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';
import { GetCategory } from './dto/getCategory.dto';
import { BoardService } from 'src/Boards/board.service';
import { MainPageDto } from './dto/mainPageRes.dto';
import { ByDateResDto } from './dto/byDateRes.dto';
import { DetailResDto } from './dto/detailRes.dto';
import { CashList } from './entity/cashList.entity';
import { GetByCashbookIdDto } from './dto/getByCashbookId.dto';
import { GetByCashDetailIdDto } from './dto/getByCashDetailId.dto';
import { PaginationDto } from 'src/Boards/dto/pagination.dto';
import { QueryDate } from './dto/queryDate.dto';
import { HttpStatus } from '@nestjs/common/enums';
import { HttpException } from '@nestjs/common/exceptions';
import { CashbookCreateDto } from './dto/cashbookCreate.dto';

@Controller('api/cashbook')
@ApiTags('가계부 관련 API')
export class CashbookContoller {
    constructor(
        private readonly cashbookService : CashbookService,
        private readonly userService : UserService,
        private readonly boardService : BoardService,
        private dataSource : DataSource
    ){}

    @Get('/main')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type: MainPageDto, description : 'data 객체 내부에 생성' })
    @ApiOperation({ summary: '메인 api', description: '몇일째 되는 날, 2주치 데이터, 당일 유저 지출 총합, 섹션별 소비' })
    async mainPage(@Req() req : any) {
        try {
            const { user } = req
            //1. 몇 일 째 되는 날
            const dateValue : number = await this.userService.userSignupDate(user.userId)
            
            //2. 2주 데이터, 남은 날은 null 처리
            const twoweek = await this.cashbookService.getCashbookDuringDate(user.userId)
        
            //3. 당일 유저 별, 섹션 별 총합목표, 총합소비
            const totalValue  = await this.cashbookService.getCashbookGroupByCate(user.userId)
            
            //4. 유저 토탈 소비 합
            const total = await this.cashbookService.totalValue(totalValue)
  
            let mainPageDto = new MainPageDto()
            mainPageDto = {
                signupDay : dateValue,
                twoweek : twoweek,
                groupByCategory : totalValue,
                total : total
            }
            return {
                data : mainPageDto
            }

        } catch(e) {
            console.log(e.stack)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

 
    @Post('frame')
    @HttpCode(201)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 생성', description: '프레임 생성 및 가계부 섹션 오늘치 생성' })
    @ApiBody({type:FrameDto})
    async cashFrameCreate (@Body() body : FrameDto, @Req() req : any) {
        //트랜잭션 스타트
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            const { user } = req
            let frameDto = new FrameDto()

            //dto에 데이터 삽입
            frameDto = {
                cashCategory : body.cashCategory,
                cashName : body.cashName,
                cashListGoalValue : body.cashListGoalValue,
                userId : user.userId
            }

            //프레임 생성
            const query = await this.cashbookService.frameCreate(frameDto, queryRunner)
            let cashbookCreateDto = new CashbookCreateDto();
            cashbookCreateDto = {
                cashbookCategory: frameDto.cashCategory,
                cashbookName: frameDto.cashName,
                cashbookGoalValue: frameDto.cashListGoalValue,
                userId: frameDto.userId,
                cashListId: query
            };
            
            //당일자 가계부 생성
            await this.cashbookService.cashbookCreate(cashbookCreateDto, queryRunner)

            //커밋
            await queryRunner.commitTransaction()
        } catch(e) {
            await queryRunner.rollbackTransaction()
            console.log(e.stack)
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await queryRunner.release()
            return {messsage : '프레임 생성이 완료되었습니다'}
        }
    }

    //카태고리 수정
    //당일 날짜의 cashbook과 cashlist를 수정
    @Put('frame/:cashbookId')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 수정', description: '프레임 수정 및 캐시북 아이디 값에 맞는 캐시북 수정' })
    @ApiBody({type:FrameDto})
    async cashFrameUpdate(@Param() getByCashbookIdDto : GetByCashbookIdDto, @Body() body: FrameDto, @Req() req: any) {
      try {
        const { user } = req
        let frameDto = new FrameDto()
        frameDto = {
                cashCategory : body.cashCategory,
                cashName : body.cashName,
                cashListGoalValue : body.cashListGoalValue,
                userId : user.userId
        } 
        await this.cashbookService.frameUpdate(getByCashbookIdDto, frameDto)
        return '프레임 수정 완료';
    } catch(e) {
        console.log(e.stack)
        throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
    }
    }

    //딜리트
    @Delete('frame/:cashbookId')
    @HttpCode(200)
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '프레임 삭제', description: '프레임 삭제 및 부모 row 전부 삭제' })
    async frameDelete(@Param() cashbookId : GetByCashbookIdDto) {
        try {
            await this.cashbookService.frameDelete(cashbookId)
            return '프레임 삭제 완료'
        } catch(e) {
            throw new HttpException(e.message,500)
        }
    }   

    //디폴트는 오늘로 전달해주시길 프론트엔드 2023-05-24 형식으로
    @Get('/')
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type:[ByDateResDto], description : 'data 객체 내부에 생성'})
    @ApiOperation({ summary: '특정 날짜 가계부 get', description: '2022-04-05 형식으로 쿼리스트링 하여 request 요구' })
    async cashList(@Query() date : QueryDate, @Req() req : any) {
        try {
            const regex = /\d{4}-\d{2}-\d{2}/; 
            if(!regex.test(date.date.toString())) {
                throw new HttpException('날짜 형식 에러', HttpStatus.BAD_REQUEST)
            }

            const { user } = req
            console.log(date) 
            let result : any = await this.cashbookService.getCashbookByDate(date,user.userId)
            if(result.length===0) {
                return {
                    data : []
                }
            } 
            const createCheck = result.map((e)=>{
                return e.cashbookId
            })
            const Checkdate = await this.boardService.BoardCheck(createCheck)
            for(let i=0; result.length>i; i++) {
                result[i].writeCheck = Number(Checkdate[result[i].cashbookId]) || 0
            }
            let byDateResDto : ByDateResDto[]
            byDateResDto = result 
            return {
                data :byDateResDto
            }
        } catch(e) {
            console.log(e.stack)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    @Get(':cashbookId')
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({type:DetailResDto, description : 'data 객체 내부에 생성'})
    @ApiOperation({ summary: '특정 카드의 디테일 정보', description: '카드이름, 카드카테고리, 디테일정보// 무지출 consumption : false' })
    async cashDetail(@Param() getByCashbookIdDto : GetByCashbookIdDto) {
        try {
            const detail = await this.cashbookService.getDetail(getByCashbookIdDto)
            console.log(detail)
            let result2 = await this.cashbookService.cashbookById(getByCashbookIdDto)
            const {cashbookId, cashbookName, cashbookCategory, cashbookNowValue, cashbookGoalValue} = result2
            const Checkdate = await this.boardService.BoardCheck([cashbookId])
            if(detail.length===0) {
                let result = new DetailResDto()
                cashbookNowValue===0 ? result['consumption'] = true : result['consumption']=false
                result['cashbookCategory'] = cashbookCategory
                result['cashbookName'] = cashbookName
                result['cashbookGoalValue'] = cashbookGoalValue
                result['writeCheck'] = Number(Checkdate[cashbookId]) || 0
                return { data : {
                    result
                }}
            //end if    
            } else {
            const result : DetailResDto = {
                cashbookName,
                cashbookCategory,
                cashbookGoalValue,
                writeCheck : Number(Checkdate[cashbookId]) || 0,
                detail 
            }
            return {data : {
                result
            }}
        }//end else    
        //end try
        } catch(e) {
            console.log(e.stack)
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }//end catch 
    }//end method
 
    @Post(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '디테일 정보 입력', description: 'cashbookId, text, value 입력' })
    @ApiBody({type:PostDetailDto})
    async postDetail(@Param() cashbookId : GetByCashbookIdDto, @Body() body : PostDetailDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            let postDetailDto = new PostDetailDto();
            const cashbook = await this.cashbookService.cashbookById(cashbookId)
            postDetailDto = {
                cashbookId : cashbook, 
                cashDetailText : body.cashDetailText,
                cashDetailValue : body.cashDetailValue
            };

            //데이터 업데이트, 입력 구간
            await this.cashbookService.postDetail(postDetailDto, queryRunner);
            let valueUpdate = new ValueUpdateDto();
            valueUpdate = {
                cashbookId : cashbook,
                cashDetailValue : body.cashDetailValue
            }
            await this.cashbookService.addValue(valueUpdate, queryRunner)
            await queryRunner.commitTransaction()
        } catch(e) {
            console.log(e.stack)
            await queryRunner.rollbackTransaction()
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await queryRunner.release()
            return `입력 성공`
        }
    }

    @Delete(":cashDetailId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '디테일 삭제', description: '디테일 삭제 API' })
    async deleteDetail(@Param() getByCashDetailId : GetByCashDetailIdDto) {
        const queryRunner = this.dataSource.createQueryRunner()
        await queryRunner.connect()
        await queryRunner.startTransaction()
        try {
            if(!getByCashDetailId) {
                throw new Error('정상적으로 요청되지 않았습니다')
            }
            const detail = await this.cashbookService.getOneDetail(getByCashDetailId)
            console.log(detail)
            if(!detail.cashbookId) {
                throw new Error('dfgdfg')
            }
            let valueUpdateDto = new ValueUpdateDto()
            const cashbook = await this.cashbookService.cashbookById({cashbookId:Number(detail.cashbookId)})
            console.log(cashbook)
            valueUpdateDto = {  
                cashbookId : cashbook,
                cashDetailValue : -Number(detail.cashDetailValue)
            }
            await this.cashbookService.addValue(valueUpdateDto,queryRunner)
            await this.cashbookService.deleteDetail(getByCashDetailId,queryRunner)
            await queryRunner.commitTransaction()
        } catch(e) {
            console.log(e.stack)
            await queryRunner.rollbackTransaction()
            throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
        } finally {
            await queryRunner.release()
            return `삭제 성공`
        }
    }

    @Put(":cashbookId")
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({ summary: '무지출 전환 API', description: '무지출 전환시 DB데이터 NULL, 활성화 시 0' })
    async checkConsume(@Param() cashbookId) {
        try {
            await this.cashbookService.inputConsume(cashbookId)
            return '무지출 지출 전환 완료'
        } catch(e) {
            console.log(e.stack) 
            throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }
    
}