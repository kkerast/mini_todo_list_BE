import { ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UserService } from 'src/Users/service/user.service';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { RedisService } from 'src/Users/service/redis.service';
@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'refresh') {

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
        private readonly redisService: RedisService
      ) {
        super({
          jwtFromRequest: ExtractJwt.fromExtractors([
            (request: Request) => {
                  const token = request.headers.refreshtoken
                  if(!token) {
                    throw new HttpException('리프레시 토큰이 없습니다.',HttpStatus.BAD_REQUEST)
                  }
                  try {
                  const test = jwtService.verify(token, {
                  secret: this.configService.get('SECRET_KEY')
                  })
                  return token; 
                 } catch(e) {
                    console.log(e)
                    throw new HttpException('리프레시 토큰이 유효하지 않습니다.',HttpStatus.FORBIDDEN)
                 }
            } 
          ]),
          secretOrKey: process.env.SECRET_KEY,
        });
      } 
      async validate(payload: any) {
          const userName = this.redisService.getRefresh(payload.userName)
          if(!userName) {
          throw new HttpException('리프레시 토큰이 DB에 없습니다', HttpStatus.BAD_REQUEST)
          }
          const user = this.userService.userByName(payload.userName);
        return user;
    }
}

