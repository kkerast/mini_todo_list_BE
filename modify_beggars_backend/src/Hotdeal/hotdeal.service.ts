import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hotdeal } from './hotdeal.entity';
import { HotdealByIdDto } from './dto/hotdealById.dto';
import { HotdealApplyDto } from './dto/hotdealApply.dto';
import { QueryRunner } from 'typeorm';
import { CreateFail, DeleteFail, ReadFail } from 'src/Utils/exception.service';
import { HotdealAddDto } from './dto/hotdealAdd.dto';
@Injectable()
export class HotdealService {
    constructor(  
        @InjectRepository(Hotdeal)
        private readonly hotdeal : Repository<Hotdeal>
    ){}
    
    //핫딜 리스트
    async getHotdealList () {
        try {
            return await this.hotdeal.createQueryBuilder('hotdeal')
            .select()
            .getMany()
        } catch(e) {
            throw new ReadFail(e.stack)
        }
    }

    //핫딜 winner 추가
    async registWinner (
        hotdealApplyDto : HotdealApplyDto,
        queryRunner : QueryRunner
    ) {
        try {
            const query = this.hotdeal.create(
                hotdealApplyDto
            )   
            return await queryRunner.manager.save(query)

        } catch(e) {

        }
    }   

    //핫딜 재고 minus
    async minusInventory (
        hotdealByIdDto : HotdealByIdDto, 
        queryRunner : QueryRunner
    ) {
        try {
            return await queryRunner.manager
            .createQueryBuilder()
            .update('Hotdeal')
            .set({ 
                userPoint: () =>
                  `hotdealLimit - 1`,
            })
            .where('hotdealId = :hotdealId', { hotdealId: hotdealByIdDto.hotdealId })
            .execute();

        } catch(e) {

        }
    }

    //핫딜 제거
    async hotdealDelete (hotdealByIdDto : HotdealByIdDto) {
        try {
            this.hotdeal.createQueryBuilder('hotdeal')
            .delete()
            .where('hotdealId=:hotdealId',{hotdealId : hotdealByIdDto.hotdealId})
        } catch(e) {
            throw new DeleteFail(e.stack)
        }
    }

    //핫딜 등록
    async addHotdeal (hotdealAdd : HotdealAddDto) {
        try {
            console.log(hotdealAdd)
            const query = this.hotdeal.create(
                hotdealAdd 
            )
            await this.hotdeal.save(query)
        } catch(e) {
            console.log(e)
            throw new CreateFail(e.stack)
        }
    }

    async readInventory (
        hotdealByIdDto : HotdealByIdDto, 
        queryRunner : QueryRunner
    ) {
        return await queryRunner.manager
        .createQueryBuilder()
        .select('Hotdeal')
        .where('hotdealId=:hotdealId',{hotdealId : hotdealByIdDto.hotdealId})
        .andWhere('hotdealLimit>0')
        .getOne()
    }

}