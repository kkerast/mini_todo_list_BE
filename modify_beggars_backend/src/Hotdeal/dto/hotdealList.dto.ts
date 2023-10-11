import { PickType } from "@nestjs/swagger";
import { HotdealDto } from "./hotdeal.dto";

export class HotdealListDto extends PickType(HotdealDto,[
    'hotdealId',
    'hotdealTitle',
    'hotdealPrice',
    'hotdealLimit',
    'hotdealImg',
    'hotdealStartDate',
    'hotdealEndDate'
]){}