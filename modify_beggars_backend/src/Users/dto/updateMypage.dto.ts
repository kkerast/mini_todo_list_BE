import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class UpdateMypageDto extends PickType(UserDto, [
  'userId',
  'userPwd',
  'userNickname',
  'userImage'
] as const) {}