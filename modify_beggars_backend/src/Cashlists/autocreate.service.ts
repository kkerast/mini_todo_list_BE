import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Cashbook } from './entity/cashbook.entity';
import { CashbookService } from './cashbook.service';
import { CashList } from './entity/cashList.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class AutoCreateService {
  constructor(
    private cashbookService: CashbookService,
    @InjectRepository(Cashbook)
    private cashbookEntity: Cashbook,
  ) {}

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async autoCashbook() { 
    try {
    const list: CashList[] = await this.cashbookService.allCashlist();
    await this.cashbookService.cashbookCreate(list);
  } catch(e) {
    throw new HttpException(e.message,HttpStatus.INTERNAL_SERVER_ERROR)
  }}
}
