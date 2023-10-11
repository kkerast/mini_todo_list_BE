import { PickType } from "@nestjs/swagger";
import { UserDto } from "./user.dto";

export class ListMypageDto extends PickType(UserDto,[
    'userId',
    'userName',
    'userNickname',
    'userType',
    'userLoginType',
    'userPoint'
]) {}