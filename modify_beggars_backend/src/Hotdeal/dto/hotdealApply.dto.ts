import { PickType } from "@nestjs/swagger";
import { HotdealWinnerDto } from "./hotdealWinner.dto";

export class HotdealApplyDto extends PickType(HotdealWinnerDto,[
    'hotdealId',
    'userId',
    'hotdealWinnerPhone'
]) {}