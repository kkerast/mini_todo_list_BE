import { Injectable } from "@nestjs/common";
import { DataSource, QueryRunner, Repository } from "typeorm";
import User from "../entity/user.entity";
import { SignupDto } from "../dto/signup.dto";
import { SocialSignupDto } from "../dto/socialSignup.dto";
import { GetByUserIdDto } from "../dto/getByUserId.dto";

@Injectable()
export class UserRepository extends Repository<User>{
    constructor(datasource:DataSource){
        super(User,datasource.createEntityManager())
    }
    
    //회원가입
    async userSignup(SignupDto: SignupDto,queryRunner:QueryRunner): Promise<any>{ 
        // return await this.createQueryBuilder("user")
        //     .insert().into(User)
        //     .values({'userName':SignupDto.userName
        //         ,'userPwd':SignupDto.userPwd
        //         ,'userNickname':SignupDto.userNickname})
        //     .execute();     
        return await queryRunner.manager.createQueryBuilder()
            .insert().into(User)
            .values({'userName':SignupDto.userName
                ,'userPwd':SignupDto.userPwd
                ,'userNickname':SignupDto.userNickname})
            .execute();     
    }

    //소셜 회원가입 서비스
    async socialSignup(SignupDto: SocialSignupDto): Promise<any>{
        return await this.createQueryBuilder("user")
            .insert().into(User)
            .values({'userName':SignupDto.userName
                ,'userNickname':SignupDto.userNickname
                ,'userType':SignupDto.userType
                ,'userLoginType':SignupDto.userLoginType,})
            .execute();
    }

    //유저아이디로 db체크
    async userByName(userName:string):Promise<User>{
        return await this.createQueryBuilder('user')
            .select(['user.userId', 'user.userName', 'user.userNickname'])
            .where('user.userName=:userName', { userName })
            .getOne();
    }

      //유저 아이디로 pwd 반환
    async allListByName(userName: string): Promise<User> {
        return await this.createQueryBuilder('user')
            .select()
            .where('user.userName=:userName', { userName })
            .getOne();
    }

    //유저닉네임으로 db체크
    async userByNickname(userNickname : string): Promise<User> {
        return await this.createQueryBuilder('user')
            .where("user.userNickname = :userNickname", { 'userNickname': userNickname })
            .getOne();
          
    }

    //
    async pointCheck(getByUserIdDto: GetByUserIdDto): Promise<number> {
        const result = await this.createQueryBuilder('user')
            .select(['userPoint'])
            .where('userId = :userId', { userId: getByUserIdDto.userId })
            .getOne(); 
        return Number(result.userPoint);
    }
    
    async pointInput(getByUserIdDto: GetByUserIdDto, point: number) { 
        return await this.createQueryBuilder('user')
            .update('User')
            .set({
                userPoint: () => `userPoint + ${point}`,
            })
          .where('userId = :userId', { userId: getByUserIdDto.userId })
          .execute();    
    }

    async getUserCreatedAt(userId: User): Promise<User> {
        return await this.createQueryBuilder('user')
            .select(['user.userCreatedAt'])
            .where('user.userId=:userId', { userId })
            .getOne();
    }

}