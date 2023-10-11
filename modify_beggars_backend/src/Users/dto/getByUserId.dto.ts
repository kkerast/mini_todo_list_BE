import { PickType } from '@nestjs/swagger';
import { SignupDto } from './signup.dto';
import { UserDto } from './user.dto';

export class GetByUserIdDto extends PickType(UserDto, ['userId'] as const) {}
