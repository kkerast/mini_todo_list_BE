import { IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { PickType } from '@nestjs/swagger';
import User from '../entity/user.entity';
import { UserDto } from './user.dto';

export class SignupDto extends PickType(UserDto, [
  'userName',
  'userPwd',
  'userNickname',
] as const) {}
