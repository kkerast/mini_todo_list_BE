import {
  Controller,
  Post,
  Req,
  Body,
  HttpCode,
  UseGuards,
  Get,
  Query,
  Redirect,
  PayloadTooLargeException,
  Res,
  HttpException,
} from '@nestjs/common';
import { SignupDto } from '../dto/signup.dto';
import { TokenDto } from '../dto/token.dto';
import { UserService } from '../service/user.service';
import { AuthService } from '../service/oauth2.service';
import { User } from '../entity/user.entity';
import { LocalAuthenticationGuard } from '../passport/local/local.guard';
import { KakaoAuthenticationGuard } from '../passport/kakao/kakao.guard';
import { KakaoStrategy } from '../passport/kakao/kakao.strategy';
import { SocialSignupDto } from '../dto/socialSignup.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';
import { HttpStatus } from 'httpstatus';
import { AccessAuthenticationGuard } from '../passport/jwt/access.guard';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
  ApiProduces,
} from '@nestjs/swagger';
import { IdCheckDto } from '../dto/idCheck.dto';
import { NickCheckDto } from '../dto/nickCheck.dto';
import { LoginDto } from '../dto/login.dto';
import { SocialInfoDto } from '../dto/socialInfo.dto';
import { RefreshAuthenticationGuard } from '../passport/refresh/refresh.guard';
import { RedisService } from '../service/redis.service';

@Controller('/api/user')
@ApiTags('유저 API')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService,
    private readonly redisService: RedisService
  ) {}

  @Post('signup')
  @HttpCode(201)
  @ApiBody({ type: SignupDto, description: '회원가입 body' })
  @ApiResponse({ status: 201, description: '회원가입이 완료되었습니다' })
  @ApiOperation({
    summary: '회원가입',
    description: '아이디, 닉네임, 비밀번호 기입',
  })
  async userSignup(
    @Body() SignupDto: SignupDto,
    @Req() req,
    @Res() res: Response,
  ) {
    try {
      const user = await this.userService.userSignup(SignupDto);
        
      let tokenDto = new TokenDto();
      tokenDto.userId = user.userId;
      tokenDto.userName = user.userName;
      tokenDto.userNickname = user.userNickname;
      
      // Token set
      const refreshToken = await this.authService.setRefreshToken(tokenDto);
      const accessToken = await this.authService.setAccessToken(tokenDto);
      await this.authService.setCookie(res, accessToken, refreshToken);
      res.setHeader('userId', user.userId);

      // nickname encoding check
      const nickname: string = await this.userService.encodeNick(
        user.userNickname,
      );

      res.setHeader('userNickname', nickname);
      res.send({
      'accessToken' : accessToken,
      'refreshToken' : refreshToken
    });
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('idCheck')
  @HttpCode(200)
  @ApiResponse({ status: 200, description: '사용 가능한 아이디 입니다' })
  @ApiOperation({ summary: '아이디 체크', description: '아이디 기입' })
  @ApiBody({ type: IdCheckDto })
  async userIdCheck(@Body() body: IdCheckDto) {
    try {
      // const byName = await this.userService.userByName(body.userName);
      const byName = await this.userService.userByName(body.userName);
      if (!byName) {
        return '사용 가능한 아이디 입니다';
      }
      throw new HttpException('중복된 아이디입니다', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }
 
  @Post('nickCheck')
  @HttpCode(200)
  @ApiOperation({ summary: '닉네임 체크', description: '아이디 기입' })
  @ApiBody({ type: NickCheckDto })
  async userNickCheck(@Req() req, @Body() body: NickCheckDto) {
    try {
      const byNickname = await this.userService.userByNickname(
        body.userNickname,
      );
      if (!byNickname) {
        return '사용 가능한 닉네임입니다';
      }
      throw new HttpException('중복된 닉네임입니다', HttpStatus.BAD_REQUEST);
    } catch (e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  @HttpCode(200)
  @UseGuards(LocalAuthenticationGuard)
  @ApiBody({ type: LoginDto })
  @ApiOperation({ summary: '일반 로그인', description: 'id , pwd 입력' })
  async userLogin(@Req() req: any, @Res() res: Response) {
    const { user } = req;
    let tokenDto = new TokenDto();
    tokenDto.userId = user.userId;
    tokenDto.userName = user.userName;
    tokenDto.userNickname = user.userNickname;
    const refreshToken = await this.authService.setRefreshToken(tokenDto);
    const accessToken = await this.authService.setAccessToken(tokenDto);

    await this.authService.setCookie(res, accessToken, refreshToken);
    res.setHeader('userId', user.userId);
    const nickname: string = await this.userService.encodeNick(
      user.userNickname,
    ); 
    res.setHeader('userNickname', nickname);
    res.send(
      {
       'accessToken' : accessToken,
       'refreshToken' : refreshToken
      });
  }

  @Post('logout')
  @HttpCode(200)
  @UseGuards(AccessAuthenticationGuard)
  @ApiResponse({ status: 200, description: '로그아웃 완료' })
  @ApiOperation({ summary: '로그아웃', description: '쿠키 클리어' })
  async userLogout(@Req() req : any) {
    try {
      const { user } = req
      await this.redisService.deleteRefresh(user.userName)
      return '로그아웃 완료'
    } catch(e) {
      throw new HttpException(e.message, HttpStatus.INTERNAL_SERVER_ERROR)
    }
  }

  @Get('login/kakao')
  @UseGuards(KakaoAuthenticationGuard)
  @HttpCode(200)
  @ApiOperation({
    summary: '카카오 로그인',
    description: '최초가입시 닉네임 기입창으로',
  })
  async kakaoLogin(@Query() query, @Req() req: any, @Res() res: Response) {
    const { user } = req;
    console.log(user);
    if (!user) {
      throw new Error('잘못된 접근입니다');
    }
    if (!user.userId) { 
      res.cookie('userName', user, {
        sameSite: 'none', 
        secure: true,
        httpOnly: false,
      });

      return res.redirect(`https://beggars-front-eight.vercel.app?loginSuccess=false`);
    }
 
    const refreshToken = await this.authService.setRefreshToken(user);
    const accessToken = await this.authService.setAccessToken(user);
    await this.authService.setCookie(res, accessToken, refreshToken);
    res.cookie('userId', user.userId, {
      sameSite: 'none', 
      secure: true,
      httpOnly: false,
    });
    const nickname: string = await this.userService.encodeNick(
      user.userNickname,
    ) 
    res.cookie('userNickname', nickname, {
      sameSite: 'none', 
      secure: true,
      httpOnly: false,
    });
    const { code } = query
    await this.redisService.setCode(code,user)
    return res.redirect(
      `https://beggars-front-eight.vercel.app?loginSuccess=true&code=${code}`
      )
    //return res.redirect(`http://testbeggars.ap-northeast-2.elasticbeanstalk.com?loginSuccess=true&code=${code}`)
  }

  @Post('signup/social')
  @HttpCode(201)
  @ApiOperation({
    summary: '카카오 회원가입',
    description: '카카오 로그인 최초, 닉네임 입력하면 네임과 같이 request',
  })
  @ApiBody({ type: SocialSignupDto })
  async signupSocial(
    @Body() body: SocialSignupDto,
    @Req() req,
    @Res() res: Response,
  ) {
    console.log(body,'body')  
    try {  
      const nickCheck = await this.userService.userByNickname(
        body.userNickname 
      );   
      console.log(nickCheck);
      if (nickCheck) {
        throw new Error('다른 닉네임을 지정해주세요');
      }
      let SignupDto: SocialSignupDto; 

      SignupDto = {
        userName: req.cookies.userName,
        userNickname: body.userNickname,
        userLoginType: 'kakao',
        userType: 1,
      };
      const user = await this.userService.socialSignup(SignupDto);

      let tokenDto = new TokenDto();
      tokenDto.userId = user.userId;
      tokenDto.userName = user.userName;
      tokenDto.userNickname = user.userNickname;

      res.clearCookie('userName')
      const refreshToken = await this.authService.setRefreshToken(tokenDto);
      const accessToken = await this.authService.setAccessToken(tokenDto);
      await this.authService.setCookie(res, accessToken, refreshToken);

      res.setHeader('userId', user.userId);
      const nickname: string = await this.userService.encodeNick(
        user.userNickname,
      );
      res.setHeader('userNickname', nickname); 
      return res.send({
        accessToken : accessToken,
        refreshToken : refreshToken
      })
    } catch (e) { 
      throw new Error(e); 
    }
  }

  @Get('login/getInfo')
  @ApiOperation({
    summary: '소셜 로그인 시 데이터',
    description: 'data : socialInfoDto',
  }) 
  @HttpCode(200) 
  async getIdAndNickname(@Query() query : any, @Res() res:Response) {
    
    const user : TokenDto = await this.redisService.getCode(query.code)
    console.log(user)
    const refreshToken = await this.authService.setRefreshToken(user);
    const accessToken = await this.authService.setAccessToken(user);
    let socialInfoDto = new SocialInfoDto()
    socialInfoDto = {
      userId : user.userId,
      userNickname : user.userNickname
    }
    return res.send({
      socialInfoDto,
      'accessToken' : accessToken,
      'refreshToken' : refreshToken
    })   
  }

  @Get('refresh')
  @UseGuards(RefreshAuthenticationGuard)
  @ApiOperation({
    summary: '리프레시 토큰 요청'
  }) 
  async refresh(@Req() req : any, @Res() res:Response) {
    const { user } = req 
    let tokenDto = new TokenDto();
    tokenDto = {
      userId : user.userId,
      userName : user.userName,
      userNickname : user.userNickname
    }  
    const accessToken = await this.authService.setAccessToken(tokenDto);
    await this.authService.setCookie(res, accessToken);
    return res.send({
      'accessToken' : accessToken
    });
  }
}
