import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class NickCheckDto extends PickType(UserDto, [
  'userNickname',
] as const) {}
