import { Injectable } from "@nestjs/common";
import { QueryRunner, Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import { Board } from "./entity/board.entity";
import { PostBoardDto } from "./dto/postBoard.dto";
import { PaginationDto } from "./dto/pagination.dto";
import { CashbookService } from "src/Cashlists/cashbook.service";
import { Cashbook } from "src/Cashlists/entity/cashbook.entity";
import { GetByCashbookIdDto } from "src/Cashlists/dto/getByCashbookId.dto";
import { GetByBoardIdDto } from "./dto/getByBoardId.dto";
import { DeleteFail, ReadFail } from "src/Utils/exception.service";

@Injectable()
export class BoardService {
    constructor(
        @InjectRepository(Board)
        private boardRepository : Repository<Board>,
        //pirvate cashlistRepository :Repository<CashlistEntity>
        private readonly cashbookService : CashbookService
    ){} 
    
    async postBoard(postBoardDto : PostBoardDto, queryRunner : QueryRunner) : Promise<any> {
        const query = this.boardRepository.create(
            postBoardDto
        )  
        return await queryRunner.manager.save(query)
    } 
 
    async deleteByboardId(boardId : number) : Promise<any> {
        try {
            return this.boardRepository.createQueryBuilder()
            .delete()
            .where({boardId:boardId})
        } catch(e) { 
            throw new DeleteFail(e.stack)
        }
        
    }

    async getListAll(paginationDto : PaginationDto) {
        try {
            const checkPage = await this.boardRepository
            .createQueryBuilder('board')
            .where('boardTypes=:boardTypes', {boardTypes:paginationDto.boardTypes})
            .skip((paginationDto.page)*paginationDto.limit)
            .take(paginationDto.limit)
            .getMany()  
            let hasNextPage = false
            checkPage.length===0 ? hasNextPage=false : hasNextPage=true
            const pageNum = paginationDto.page

            const result : any = {
            boards: await this.boardRepository
            .createQueryBuilder('board')
            .leftJoin('board.cashbookId','cashbook')
            //.innerJoinAndSelect('cashbookId.cashbookId','cashdetail')
            .leftJoin('board.userId','user')
            .select(['board','cashbook','user.userNickname','user.userName'])
            .where('board.boardTypes=:boardTypes', {boardTypes:paginationDto.boardTypes})
            .orderBy('board.boardCreatedAt',"DESC")
            .skip((paginationDto.page-1)*paginationDto.limit)
            .take(paginationDto.limit) 
            .getMany(),
            pageNum,
            hasNextPage
            }
            return result;
        } catch(e) { 
            throw new ReadFail(e.stack)
        }
    }

    async getBoardDetail(getByBoardIdDto : GetByBoardIdDto) : Promise<Board> {
        try {
            return await this.boardRepository
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.userId','user')
            .leftJoinAndSelect('board.comments','comment')
            .leftJoinAndSelect('comment.userId','commentUser')
            .leftJoinAndSelect('comment.likes','like')
            .select([
            'board',
            'comment',
            'comment.userId',
            'user.userId',
            'user.userNickname',
            'user.userName',
            'commentUser.userId',
            'commentUser.userName',
            'commentUser.userNickname'])
            .where('board.boardId=:boardId',{boardId : getByBoardIdDto.boardId})
            .getOne()
        } catch(e) {
            throw new ReadFail(e.stack)
        }
    }

    async getDetailByBoardId(getByBoardIdDto : GetByBoardIdDto) : Promise<Cashbook> {
        try {
            const boards = await this.boardRepository
            .createQueryBuilder('board')
            .leftJoinAndSelect('board.cashbookId','cashbook')
            .where('board.boardId=:boardId',{boardId : getByBoardIdDto.boardId})
            .getOne()
            const cashbookId : GetByCashbookIdDto = boards.cashbookId
            return await this.cashbookService.getcashbookAndDetail(cashbookId)
        } catch(e) {
            throw new ReadFail(e.stack)
        }
        
    }

    async BoardCheck(cashbookIds : number[]) {
        try {
            const query = await this.boardRepository
            .createQueryBuilder('board')
            .select('boardId')
            .addSelect('cashbookId')
            .where('cashbookId IN (:...cashbookIds)',{cashbookIds})
            .getRawMany()
            const result = {}
            for(let i=0; query.length>i; i++) {
                result[query[i].cashbookId] = query[i].boardId 
            }
            return result;
        } catch(e) {
            throw new ReadFail(e.stack)
        }

    }

}