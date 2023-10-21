import {
    Controller,
    Post,
    Req,
    Body,
    Put,
    HttpCode,
    UseGuards,
    Get,
    Delete,
    Res,
    Param,
    UploadedFile,
    UseInterceptors,
    ParseFilePipe,
    FileTypeValidator,
    HttpException
  } from '@nestjs/common';
  import { UserService } from '../service/user.service';
  import { AuthService } from '../service/oauth2.service';
  import { Response, Express } from 'express';
  import { HttpStatus } from 'httpstatus';
  import { AccessAuthenticationGuard } from '../passport/jwt/access.guard';
  import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiConsumes,
  } from '@nestjs/swagger';
  import { UpdateMypageDto } from '../dto/updateMypage.dto';
  import { MypageService } from '../service/mypage.service';
  import { FileInterceptor } from '@nestjs/platform-express';
import { DeleteMypageDto } from '../dto/deleteMypage.dto';
import { LoginDto } from '../dto/login.dto';
import { GetByUserIdDto } from '../dto/getByUserId.dto';
import { ListMypageDto } from '../dto/listMypage.dto';
import { TranscationInterceptor } from 'src/Utils/interaptors/transcation.interaptor';
import { transcationEntityManager } from 'src/Utils/decorators/transcation.entity.manager';
  // import AutoEncryptionLoggerLevel from 'typeorm';
  
  @Controller('/api/mypage')
  @ApiTags('마이페이지 API')
  export class MypageController {
    constructor(
      private readonly userService: UserService,
      private readonly authService: AuthService,
      private readonly mypageService: MypageService,
    ) {}
  
    @Get()
    @UseGuards(AccessAuthenticationGuard)
    @UseInterceptors(TranscationInterceptor)
    @ApiResponse({
      status: 200,
      type: UpdateMypageDto,
      description: '마이페이지 조회',
    })
    async mypageInfo(@Req() req: any,@transcationEntityManager() transcationEntityManager) {
      //회원정보 확인
      // const { user } = req;
      // let getByUserIdDto = new GetByUserIdDto();
      // getByUserIdDto.userId = user.userId
      // const result : ListMypageDto = await this.mypageService.mypageInfo(getByUserIdDto);
      // return `{data : ${JSON.stringify(result)}}`;

      
      const { user } = req;
      return await this.mypageService.mypageInfo(user,transcationEntityManager);
    }
  
    @Put()
    @UseGuards(AccessAuthenticationGuard)
    @ApiOperation({
      description: '마이페이지 수정 ,패스워드,닉네임 필수',
    })
    @ApiResponse({
      status: 201,
      type: UpdateMypageDto,
    })
    @ApiConsumes('multipart/form-data')
    @UseInterceptors(FileInterceptor('file'))
    async mypageUpdate(
      @Req() req: any,
      @Body() updateMypageDto: UpdateMypageDto,
      @UploadedFile(
        new ParseFilePipe({
          validators: [
            new FileTypeValidator({ fileType: '.(png|jpeg|jpg|svg)' }),
          ],
          fileIsRequired: false,
        }),
      ) 
      file: Express.Multer.File,
      @Res() res: Response,
    ) {
      try {
        console.log('controller----',file)
        const { user } = req;
        // let user = new mypageDTO();
        // user.userId = 7;

        if (!updateMypageDto.userPwd) {
          throw new HttpException('패스워드 입력은 필수 값입니다!', HttpStatus.BAD_REQUEST)
        }
        if (!updateMypageDto.userNickname) {
          throw new HttpException('닉네임 입력은 필수 값입니다!', HttpStatus.BAD_REQUEST)
        }
  
        updateMypageDto.userId = user.userId
  
        // nickname 유니크 체크
        const checkCntNickName = await this.mypageService.nickNamecheck(
          updateMypageDto,
        );
  
        if (checkCntNickName['count'] == 0) {
          await this.mypageService.mypageUpdate(updateMypageDto, file);
          return res.status(200).send('수정완료');
        } else {
          throw new HttpException('동일한 닉네임 존재', HttpStatus.BAD_REQUEST)
        }
      } catch (e) {
        console.log(e)
        throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  
    @Delete()
    @UseGuards(AccessAuthenticationGuard)
    @ApiResponse({
      status: 201,
      type: String,
      description: '마이페이지 회원탈퇴 ',
    })
    async mypageDelete(
      @Req() req: any,
      @Body() deleteMypageDto : DeleteMypageDto
    ) {
      try {
        const { user } = req;
        deleteMypageDto.userId = user.userId
        const result = await this.mypageService.mypageDelete(deleteMypageDto);
        return `{data : ${JSON.stringify(result)}}`
      } catch (e) {
        throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
      }
    }
  
    // @Header(
    //   'Content-Disposition',
    //   `attachment; filename=${encodeURIComponent('profile.file')}`,
    // )
    // async fileDonwload(@Req() req: any, @Res() res: Response) {
    //   const { user } = req;
  
    //   let mypageData = new mypageDto();
    //   mypageData['userId'] = user.userId;
    //   const result = await this.mypageService.fileDonwload(res, mypageData);
    // }
  
    // @Post('/upload')
    // @UseInterceptors(FileInterceptor('file'))
    // uploadFile(@UploadedFile() file: Express.Multer.File) {
    //   try {
    //     console.log('=======================@@@@@');
    //     console.log(JSON.stringify(file));
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  }