import { Module, Controller } from '@nestjs/common';
import { UserService } from './service/user.service';
import { AuthService } from './service/oauth2.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ConfigService, ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entity/user.entity';
import { UserController } from './user.controller';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './passport/local/local.strategy';
import { KakaoStrategy } from './passport/kakao/kakao.strategy';
import { AccessStrategy } from './passport/jwt/access.strategy';
import { RefreshStrategy } from './passport/refresh/refresh.strategy';
import { RedisService } from './service/redis.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { MypageService } from './service/mypage.service';
import { MypageController } from './controller/mypage.controller';
import { MulterModule } from '@nestjs/platform-express';
import { MulterConfigService } from 'src/Utils/multer.config';
import { UserRepository } from './repository/user.repository';

@Module({
  imports: [
    // TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([User]),
    PassportModule,
    JwtModule.register({
      secret: process.env.SECRET_KEY,
    }),
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useClass: MulterConfigService,
      inject: [ConfigService],
  })
  ],
  controllers: [UserController, MypageController],
  providers: [
    UserService,
    AuthService,
    JwtService,
    ConfigService, 
    LocalStrategy,
    KakaoStrategy,
    AccessStrategy,
    RefreshStrategy,
    RedisService,
    MypageService,
  ],
  exports: [UserService, AuthService, JwtService, RedisService, MypageService],
})
export class UserModule {}
