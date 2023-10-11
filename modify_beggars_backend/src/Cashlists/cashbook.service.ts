import { Injectable } from '@nestjs/common';
import { Repository, Join, EntityManager, QueryBuilder, DataSource, QueryRunner } from 'typeorm';
import { CashDetail } from './entity/cashDetail.entity';
import { Cashbook } from './entity/cashbook.entity';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { PostDetailDto } from './dto/postDetail.dto';
import User from 'src/Users/entity/user.entity';
import { ValueUpdateDto } from './dto/valueUpdate.dto';
import { FrameDto } from './dto/frame.dto';
import { CashList } from './entity/cashList.entity';
import { ListBoard } from 'src/Boards/dto/listBoard.dto';
import { CashbookCreateDto } from './dto/cashbookCreate.dto';
import { GetByCashbookIdDto } from './dto/getByCashbookId.dto';
import { GetByCashDetailIdDto } from './dto/getByCashDetailId.dto';
import { QueryDate } from './dto/queryDate.dto';
import { CreateFail, DeleteFail, ReadFail, UpdateFail } from 'src/Utils/exception.service';
import { CashbookDto } from './dto/cashbook.dto';
import { GetCategory } from './dto/getCategory.dto';
//import * as moment from 'moment-timezone';
const moment = require('moment-timezone');

@Injectable()
export class CashbookService { 
  constructor(
    @InjectRepository(CashDetail)
    private readonly cashDetailEntity: Repository<CashDetail>,
    @InjectRepository(Cashbook)
    private readonly cashbookEntity: Repository<Cashbook>,
    @InjectRepository(CashList)
    private readonly cashListEntity: Repository<CashList>,
    private dataSource : DataSource
  ) {}

  async getcashbookAndDetail(cashbook: GetByCashbookIdDto): Promise<Cashbook> {
    const result = await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .innerJoinAndSelect('cashbook.detail', 'cashDetail')
      .innerJoinAndSelect('cashbook.userId', 'user.userId')
      .where('cashbook.cashbookId=:cashbookId', {
        cashbookId: cashbook.cashbookId,
      })
      .getOne();
    console.log(result);
    if (!result) {
      return await this.cashbookById(cashbook);
    } else {
      return result;
    }
  }

  async getDetail(getByCashbookIdDto: GetByCashbookIdDto): Promise<CashDetail[]> {
    return await this.cashDetailEntity
      .createQueryBuilder('cashDetail')
      .where('cashDetail.cashbookId=:cashbookId', { cashbookId: getByCashbookIdDto.cashbookId })
      .orderBy('cashDetail.cashDetailCreatedAt', 'ASC')
      .getMany();
  }

  async postDetail(postDetailDto: PostDetailDto, queryRunner : QueryRunner): Promise<any> {
    console.log(postDetailDto, 'postDetail');
    const query = this.cashDetailEntity.create(postDetailDto);

    let valueUpdateDto = new ValueUpdateDto();
    valueUpdateDto = {
      cashbookId: postDetailDto.cashbookId,
      cashDetailValue: Number(postDetailDto.cashDetailValue),
    };
    await queryRunner.manager.save(query)
  }

  async deleteDetail(getByCashDetailId: GetByCashDetailIdDto, queryRunner : QueryRunner): Promise<any> {
    try {
      return await queryRunner.manager
        .createQueryBuilder()
        .delete()
        .from('cashDetail')
        .where('cashDetail.cashDetailId=:cashDetailId', getByCashDetailId)
        .execute();
    } catch(e) {

    }
  }

  async getCashbookByDate(
    date: QueryDate,
    userId: Number,
  ): Promise<Cashbook[]> {
    try {
      const result = await this.cashbookEntity.query(
        `SELECT cashbookId, cashbookName, cashbookCategory, cashbookNowValue, cashbookGoalValue 
            FROM Cashbook 
            WHERE DATE(cashbookCreatedAt) = DATE(?)
            AND userId = ?
            ORDER BY cashbookCreatedAt DESC`,
        [date.date, userId], 
      );  
      return result; 
    } catch(e) {
      throw new ReadFail(e.stack) 
    }
  }

  async getCashbookGroupByCate(
    userId: Number,
  ): Promise<GetCategory[]> {

    let nowdate2 = new Date()
      nowdate2.setHours(nowdate2.getHours() + 9 - 24)
      console.log(nowdate2) 
      let query = new QueryDate()
      query = {
          date : nowdate2 
      }
    try {
      const yesterday = query.date
      yesterday.setHours(yesterday.getHours() - 9)
      const result : GetCategory[] = await this.cashbookEntity.query(
        `SELECT cashbookCategory, sum(cashbookNowValue) as cashbookNowValue, sum(cashbookGoalValue) as cashbookGoalValue
            FROM Cashbook 
            WHERE DATE(cashbookCreatedAt) = DATE(?)
            AND userId = ?   
            GROUP BY cashbookCategory
            ORDER BY cashbookNowValue DESC`,
        [yesterday, userId],  
      );
      console.log(result)
      result.forEach(item => {
        item.cashbookNowValue = Number(item.cashbookNowValue);
        item.cashbookGoalValue = Number(item.cashbookGoalValue);
      });
      console.log(result)
      return result; 
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  async addValue(valueUpdate: ValueUpdateDto, queryRunner : QueryRunner): Promise<any> {
    try {
      await queryRunner.manager
        .createQueryBuilder()
        .update('Cashbook')
        .set({
          cashbookNowValue: () =>
            `cashbookNowValue + ${valueUpdate.cashDetailValue}`,
        })
        .where('cashbookId=:cashbookId', {
          cashbookId: valueUpdate.cashbookId.cashbookId,
        })
        .execute();
    } catch(e) {
      throw new UpdateFail(e.stack)
    }
  }

  async getCashbookDuringDate(userId: User): Promise<any> {
    try {
      let tempdate = moment().tz("Asia/Seoul")
      let endDate = tempdate.toDate()
      const day: number = endDate.getDay() + 7 + 1;
      let startDate = new Date();
      startDate.setDate(endDate.getDate() - day);
      startDate.setHours(startDate.getHours() + 9)
      endDate.setDate(endDate.getDate() + 2);
      endDate.setHours(endDate.getHours() + 9)
      const query = await this.cashbookEntity.query(
        `SELECT cashbookId, CONVERT_TZ(DATE(cashbookCreatedAt), @@session.time_zone, '+09:00') AS dt,
         cashbookCategory, 
         cashbookNowValue, 
         cashbookGoalValue
              FROM Cashbook
              WHERE DATE(cashbookCreatedAt) > DATE(?)
              AND DATE(cashbookCreatedAt) < DATE(?)
              AND userId = ?
              GROUP BY dt, cashbookCategory, cashbookId
              ORDER BY DATE(cashbookCreatedAt)`,
        [startDate, endDate, userId],
      ); 
      console.log(query)
      let array = new Array(14).fill(null);
      moment.tz.setDefault('Asia/Seoul');
      let lastSunday = moment().startOf('week');
      lastSunday = lastSunday.clone().subtract(7, 'days');

      let thisSaturday = moment().endOf('week');

      let result = [];
      for (
        let m = moment(lastSunday);
        m.isBefore(thisSaturday) || m.isSame(thisSaturday);
        m.add(1, 'days')
      ) {
        result.push(m.format('YYYY-MM-DD'));
      }

      let trueResult = result.reduce(
        (result, key, i) => ({ ...result, [key]: array[i] }),
        {},
      );
      
      //실패하면 실패한 날짜 갱신
      let flag = '';

      //전부 다 0일 경우 flag
      

      for (let a = 0; query.length > a; a++) {
        let tostring = query[a]['dt'].toISOString().split('T')[0];
        if(query[a]['cashbookNowValue']===0) {
          flag = tostring;
          continue;
        }

        if (
          Number(query[a]['cashbookGoalValue']) >=
          Number(query[a]['cashbookNowValue'])
          || !query[a]['cashbookNowValue']
        ) {
          flag === tostring
            ? (trueResult[tostring] = 1)
            : (trueResult[tostring] = 2); 
        } else if (
          Number(query[a]['cashbookGoalValue']) <
          Number(query[a]['cashbookNowValue'])
        ) {
          trueResult[tostring] === 1 || 2
            ? (trueResult[tostring] = 1)
            : (trueResult[tostring] = 0);
          flag = tostring;
        }
      }
      return trueResult;
   } catch(e) {
      throw new ReadFail(e.stack)
   }
  }

  async getOneDetail(
    getByCashbookId: GetByCashDetailIdDto,
  ): Promise<CashDetail> {
    try {
      const result = await this.cashDetailEntity.query(
        `SELECT cashbookId, cashDetailValue
              FROM cashDetail
              WHERE cashDetailId = ?
              `,
        [getByCashbookId.cashDetailId],
      );

    return result[0];

    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  async cashbookCreate(cashbookList: any, queryRunner?: QueryRunner) {
    try {
      if (Array.isArray(cashbookList)) {
        for (let i = 0; cashbookList.length > i; i++) {
          const query = this.cashbookEntity.create({
            cashbookCategory: cashbookList[i].cashCategory,
            cashbookName: cashbookList[i].cashName,
            cashbookGoalValue: cashbookList[i].cashListGoalValue,
            userId: cashbookList[i].userId,
            cashListId: cashbookList[i],
          });
          await this.cashbookEntity.save(query);
        } 
      } else {
        const query = this.cashbookEntity.create({
          cashbookCategory: cashbookList.cashbookCategory,
          cashbookName: cashbookList.cashbookName,
          cashbookGoalValue: cashbookList.cashbookGoalValue,
          userId: cashbookList.userId, 
          cashListId: cashbookList.cashListId,
        });
        await queryRunner.manager.save(query);
    }
    } catch(e) {
      throw new CreateFail(e.stack)
    }
  }

  async frameCreate(frameDto: FrameDto, queryRunner: QueryRunner) : Promise<CashList> {
    try {
      const frame = this.cashListEntity.create(frameDto);
      const query = await queryRunner.manager.save(frame);
      return query;
    } catch(e) {
      throw new CreateFail(e.stack)
    }
  }

  async frameUpdate(cashbook: GetByCashbookIdDto, frameDto: FrameDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const cashList = await this.cashbookEntity
                      .createQueryBuilder('cashbook')
                      .leftJoinAndSelect('cashbook.cashListId', 'cashList')
                      .where('cashbookId=:cashbookId', {
                        cashbookId: Number(cashbook.cashbookId),
                      })
                      .getOne();
      const cashListId = cashList.cashListId.cashListId;
      await queryRunner.manager
      .createQueryBuilder()
      .update('CashList')
      .set({
        cashListGoalValue: frameDto.cashListGoalValue,
        cashCategory: frameDto.cashCategory,
        cashName: frameDto.cashName,
      })
      .where('cashListId=:cashListId', { cashListId })
      .execute();

      await queryRunner.manager
      .createQueryBuilder()
      .update('Cashbook')
      .set({ 
        cashbookGoalValue: frameDto.cashListGoalValue,
        cashbookCategory: frameDto.cashCategory,
        cashbookName: frameDto.cashName,
      })
      .where('cashbookId=:cashbookId', {
        cashbookId: Number(cashbook.cashbookId),
      })
      .execute();
      await queryRunner.commitTransaction();
    } catch(e) {
        await queryRunner.rollbackTransaction();
        throw new UpdateFail(e.stack)
    } finally {
        await queryRunner.release();
    }
  }

  async frameDelete(cashbook: GetByCashbookIdDto) {
    const queryRunner = this.dataSource.createQueryRunner()
    await queryRunner.connect()
    await queryRunner.startTransaction()
    try {
      const cashList = await this.cashbookEntity
      .createQueryBuilder('cashbook')
      .leftJoinAndSelect('cashbook.cashListId', 'cashList')
      .where('cashbookId=:cashbookId', {
        cashbookId: Number(cashbook.cashbookId),
      })
      .getOne();
      const cashListId = cashList.cashListId.cashListId;
      await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('Cashbook')
      .where('cashbookId=:cashbookId', {
        cashbookId: Number(cashbook.cashbookId)
      })
      .execute() 
      await queryRunner.manager
      .createQueryBuilder()
      .delete()
      .from('CashList')
      .where('cashListId=:cashListId', { cashListId })
      .execute() 
      console.log(cashbook.cashbookId)
      await queryRunner.commitTransaction()
    } catch(e) {
      await queryRunner.rollbackTransaction()
      throw new DeleteFail(e.stack)
    } finally {
      console.log('출력')
      await queryRunner.release()
    }
  }

  async allCashlist(): Promise<CashList[]> {
    try {
      return await this.cashListEntity
            .createQueryBuilder('cashList')
            .leftJoinAndSelect('cashList.userId', 'user')
            .select()
            .getMany();
    } catch(e) {
        throw new ReadFail(e.stack)
    }
  }

  async cashbookById(
    getByCashbookIdDto: GetByCashbookIdDto,
  ): Promise<Cashbook> {
    console.log(getByCashbookIdDto)
    try {
      return await this.cashbookEntity
        .createQueryBuilder()
        .select()
        .where('cashbookId=:cashbookId', {
          cashbookId: getByCashbookIdDto.cashbookId,
        })
        .getOne();
    } catch(e) {
        throw new CreateFail(e.stack)
    }
  }

  async inputConsume(cashbookId: Cashbook) {
    try {
      const cashbook = await this.cashbookById(cashbookId);
      let cashbookNowValue = cashbook.cashbookNowValue;
      if (cashbookNowValue === 0) {
        cashbookNowValue = null;
      } else {
        cashbookNowValue = 0;
      }
      console.log(cashbookNowValue);
      return await this.cashbookEntity
        .createQueryBuilder('cashbook')
        .update()
        .set({ cashbookNowValue: cashbookNowValue })
        .where('cashbookId=:cashbookId', cashbookId)
        .execute();
    } catch(e) {
        throw new UpdateFail(e.stack)
    }
  }

  async totalValue(totalValue : GetCategory[]) {
    try {
      let total = { 
        cashbookNowValue : 0,
        cashbookGoalValue : 0 
      }
      
      for(let i=0; totalValue.length>i; i++) {
        total.cashbookNowValue += Number(totalValue[i].cashbookNowValue)
        total.cashbookGoalValue += Number(totalValue[i].cashbookGoalValue)
      }
      return total;
    } catch(e) {
      throw new ReadFail(e.stck)
    }
  }
}
