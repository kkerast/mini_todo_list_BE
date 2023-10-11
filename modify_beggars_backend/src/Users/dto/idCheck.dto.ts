import { PickType } from '@nestjs/swagger';
import { UserDto } from './user.dto';

export class IdCheckDto extends PickType(UserDto, ['userName'] as const) {}
