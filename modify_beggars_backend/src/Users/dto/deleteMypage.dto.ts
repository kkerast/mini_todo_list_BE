import { PickType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class DeleteMypageDto extends PickType(UserDto, [
    'userId',
    'userPwd'
]){}