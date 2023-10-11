import { PickType } from "@nestjs/swagger";
import { HotdealDto } from "./hotdeal.dto";

export class HotdealAddDto extends PickType(HotdealDto,[
    'hotdealTitle',
    'hotdealPrice',
    'hotdealLimit',
    'hotdealImg',
    'hotdealStartDate'
]) {}