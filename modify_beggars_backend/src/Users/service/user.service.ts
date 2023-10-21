import { InjectRepository } from '@nestjs/typeorm';
import { Injectable ,Res,HttpException} from '@nestjs/common';
import User from '../entity/user.entity';
import { Repository, In, QueryRunner, DataSource, Any, InsertResult } from 'typeorm';
import { SignupDto } from '../dto/signup.dto';
import * as bcrypt from 'bcrypt';
import { SocialSignupDto } from '../dto/socialSignup.dto';
import { GetByUserIdDto } from '../dto/getByUserId.dto';
import { CreateFail, ReadFail, UpdateFail } from 'src/Utils/exception.service';
import TokenDto from '../dto/token.dto';
import { AuthService } from './oauth2.service';
import { UserRepository } from '../repository/user.repository';
@Injectable()
export class UserService {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User)
    private readonly userRepository: UserRepository,
    private dataSource: DataSource
    //private userRepository: Repository<User>,
  ) {}
  
  //회원가입 서비스
  async userSignup(SignupDto: SignupDto ): Promise<any> {

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      //트랜잭션
      SignupDto.userPwd = await bcrypt.hash(SignupDto.userPwd, 12);
      
      // const query = this.userRepository.create(SignupDto);
      // await this.userRepository.save(query);
       // const queryRunner = this.dataSource.createQueryRunner();
       
      const query =  await this.userRepository.userSignup(SignupDto,queryRunner);
      await queryRunner.commitTransaction();

      return query;

    } catch(e) {
      await queryRunner.rollbackTransaction();
      throw e;
      //throw new CreateFail(e.stack)
    
    }finally {
      await queryRunner.release();
    }
    
  }


  //소셜 회원가입 서비스
  async socialSignup(SignupDto: SocialSignupDto): Promise<any> {
    try {
      // const query = this.userRepository.create(SignupDto);
      // await this.userRepository.save(query);
      // return query;

      return await this.userRepository.socialSignup(SignupDto);
    } catch(e) {
      throw new CreateFail(e.stack)
    }
  }

  //유저아이디로 db체크
  async userByName(userName: string): Promise<User> {
    try {
      // const query = await this.userRepository
      // .createQueryBuilder('user')
      // .select(['user.userId', 'user.userName', 'user.userNickname'])
      // .where('user.userName=:userName', { userName })
      // .getOne();
      // return query;
      return await this.userRepository.userByName(userName);
      
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  //유저 아이디로 pwd 반환
  async allListByName(userName: string): Promise<User> {
    try {
      // const query = await this.userRepository
      // .createQueryBuilder('user')
      // .select()
      // .where('user.userName=:userName', { userName })
      // .getOne();
      // return query;
      return await this.userRepository.allListByName(userName);
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  //유저닉네임으로 db체크
  async userByNickname(userNickname : string): Promise<User> {
    try {
      // const query = await this.userRepository.findOne({
      //   where: { userNickname },
      // }); 
      return await this.userRepository.userByNickname(userNickname);

     
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  } 

  async pointCheck(getByUserIdDto: GetByUserIdDto): Promise<number> {
    try {
      return await this.userRepository.pointCheck(getByUserIdDto);

      // const result = await this.userRepository
      // .createQueryBuilder('user')
      // .select(['userPoint'])
      // .where('userId = :userId', { userId: getByUserIdDto.userId })
      // .getOne(); 
      // return Number(result.userPoint);
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }

  async pointInput(getByUserIdDto: GetByUserIdDto, point: number, queryRunner : QueryRunner) {
    try {
      // return await queryRunner.manager
      // .createQueryBuilder()
      // .update('User')
      // .set({
      //   userPoint: () =>
      //     `userPoint + ${point}`,
      // })
      // .where('userId = :userId', { userId: getByUserIdDto.userId })
      // .execute();
      return await this.userRepository.pointInput(getByUserIdDto,point);

     
    } catch(e) {
      throw new UpdateFail(e.stack)
    }
  }

  async encodeNick(nickname: string) {
    return encodeURIComponent(nickname);
  }

  async userSignupDate(userId: User) {
    try {
      const now: string = new Date().toISOString().split('T')[0];
      const nowdate = new Date(now);
      // let date = await this.userRepository
      //   .createQueryBuilder('user')
      //   .select(['user.userCreatedAt'])
      //   .where('user.userId=:userId', { userId })
      //   .getOne();
      let date = await this.userRepository.getUserCreatedAt(userId);

      const tempdate: string = new Date(date.userCreatedAt)
        .toISOString()
        .split('T')[0];
      const signupdate: Date = new Date(tempdate);
      const diffDate = nowdate.getTime() - signupdate.getTime();
      return Math.abs(diffDate / (1000 * 60 * 60 * 24));
    } catch(e) {
      throw new ReadFail(e.stack)
    }
  }
  
}
function encodeNick(userNickname: any): string | PromiseLike<string> {
  throw new Error('Function not implemented.');
}

