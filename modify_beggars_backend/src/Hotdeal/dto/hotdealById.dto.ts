import { HotdealDto } from "./hotdeal.dto";
import { PickType } from "@nestjs/swagger";
export class HotdealByIdDto extends PickType(HotdealDto,[
    'hotdealId'
]){}