import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Body, Req, Res } from '@nestjs/common';
import User from '../entity/user.entity';
import { Repository, In } from 'typeorm';
import { TokenDto } from '../dto/token.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { Response } from 'express';
import { RedisService } from './redis.service';
import { UserRepository } from '../repository/user.repository';

@Injectable()
export class AuthService {
  constructor(
    
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    // private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService,
    private readonly redisService: RedisService
  ) {}

  //패스워드 DB확인
  async userCheck(userName: string, userPwd: string): Promise<User> {
    if (!userName || !userPwd) {
      throw new Error('아이디나 비번이 없다');
    }
    //아이디 확인
    const byName: User = await this.userService
      .allListByName(userName)
      .catch((e) => {
        throw new Error('아이디가 DB에 없습니다');
      });
    //console.log(byName)
    //DB 데이터 확인
    const result = await bcrypt.compare(userPwd, byName.userPwd);

    if (!result) {
      throw new Error('비밀번호가 일치하지 않습니다');
    }

    return byName;
  }

  //액세스 토큰 발급
  async setAccessToken(tokenDto: TokenDto) {
    const accessToken = this.jwtService.sign(
      JSON.parse(JSON.stringify(tokenDto)),
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.ACCESS_TIME,
      },
    );
    const test = await this.jwtService.verify(accessToken, {
      secret: process.env.SECRET_KEY,
    });
    return `${accessToken}`;
  }

  //리프레시 토큰 발급
  async setRefreshToken(tokenDto: TokenDto) {

    const refreshToken = this.jwtService.sign(
      JSON.parse(JSON.stringify(tokenDto)),
      {
        secret: process.env.SECRET_KEY,
        expiresIn: process.env.REFRESH_TIME,
      },
    );
    this.redisService.setRefresh(tokenDto.userName,refreshToken)
    return `${refreshToken}`;
  }

  //
  async setCookie(
    @Res() res: Response,
    accessToken: string,
    refreshToken?: string,
  ) {
    if (refreshToken) {
      res.cookie('refreshToken', refreshToken, {
        //domain : 'poorkingapi.shop',
        sameSite: 'none',
        secure: true,
        httpOnly: true,
      });
    }
    res.cookie('accessToken', accessToken, {
      //domain : 'poorkingapi.shop',
      sameSite: 'none',
      secure: true,
      httpOnly: true,
    });
    return '쿠키 세팅 완료';
  }
}
