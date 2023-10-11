import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../../service/oauth2.service';
import { User } from '../../entity/user.entity';
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({
      usernameField: 'userName',
      passwordField: 'userPwd',
    });
  }

  async validate(userName: string, userPwd: string): Promise<User> {
    return this.authService.userCheck(userName, userPwd);
  }
}
