import { IsNotEmpty } from 'class-validator';
import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class TokenDto extends PickType(UserDto, [
  'userId',
  'userName',
  'userNickname',
] as const) {}

export default TokenDto;
