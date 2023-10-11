import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class SocialInfoDto extends PickType(UserDto, [
    'userId',
    'userNickname' 
  ] as const) {} 