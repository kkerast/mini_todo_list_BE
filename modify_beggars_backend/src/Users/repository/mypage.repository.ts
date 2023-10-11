import { Injectable } from "@nestjs/common";
import { DataSource, Repository } from "typeorm";
import User from "../entity/user.entity";
import { GetByUserIdDto } from "../dto/getByUserId.dto";
import { ListMypageDto } from "../dto/listMypage.dto";
import { UpdateMypageDto } from "../dto/updateMypage.dto";
import { DeleteMypageDto } from "../dto/deleteMypage.dto";

@Injectable()
export class MypageRepository extends Repository<User>{
    constructor(datasource:DataSource){
        super(User,datasource.createEntityManager())
    }

    async mypageInfo(getByUserIdDto : GetByUserIdDto) : Promise<ListMypageDto>{
      
        return  this.createQueryBuilder('user')
            .select([
                'user.userId',
                'user.userName',
                'user.userNickname',
                'user.userType',
                'user.userLoginType',
                'user.userPoint',
          ])
          .where('user.userId = :id', { id: getByUserIdDto.userId })
          .getOne();
    }


    async userInfo(getByUserIdDto: GetByUserIdDto) :Promise<any>{

        return await this.createQueryBuilder('user')
            .select(['user.userPwd', 'user.userImage', 'user.userNickname'])
            .where('user.userId = :id', { id: getByUserIdDto.userId })
            .getOne();
    }

    
    async nickNamecheck(updateMypageDto: UpdateMypageDto) :Promise<any>{

        return await this.createQueryBuilder('user')
            .select('COUNT(*) as count')
            .where('user.userNickname =:nickname', {nickname: updateMypageDto.userNickname,})
            .andWhere('user.userId != :id', { id: updateMypageDto.userId })
            .getRawOne();
    }


    async mypageDelete(deleteMypageDto: DeleteMypageDto) {

        return await this.createQueryBuilder('user')
            .delete()
            .from(User)
            .where('user.userId = :id', { id: deleteMypageDto.userId })
            .execute();
    }
    
    async mypageUpdate(updateMypageDto: UpdateMypageDto,setObj: {}) :Promise<any> {
        return await this.createQueryBuilder('user')
          .select()
          .update()
          .set({
            ...setObj,
          })
          .where('userId = :id', { id: updateMypageDto.userId })
          .execute();
    }

    //end
}