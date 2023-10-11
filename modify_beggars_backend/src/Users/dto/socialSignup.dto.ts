import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SocialSignupDto extends PickType(UserDto, [
  'userName',
  'userNickname',
  'userType',
  'userLoginType',
] as const) {}
