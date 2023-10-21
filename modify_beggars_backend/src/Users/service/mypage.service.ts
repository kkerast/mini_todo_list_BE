
import { Express } from 'express'
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, Req, Res, StreamableFile } from '@nestjs/common';
import User from '../entity/user.entity';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UserService } from './user.service';
import { UpdateMypageDto } from '../dto/updateMypage.dto';
import * as bcrypt from 'bcrypt';
import { createReadStream } from 'fs';
import path from 'path';
import { DeleteMypageDto } from '../dto/deleteMypage.dto';
import { GetByUserIdDto } from '../dto/getByUserId.dto';
import { ListMypageDto } from '../dto/listMypage.dto';
import { DeleteFail, ReadFail, UpdateFail } from 'src/Utils/exception.service';
import { MypageRepository } from '../repository/mypage.repository';
import { transcationEntityManager } from 'src/Utils/decorators/transcation.entity.manager';


@Injectable()
export class MypageService {
  constructor(
    @InjectRepository(User)
    private mypageRepository: MypageRepository,
    // private userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly userService: UserService, // private readonly fileService: FileService,
  ) {}

  async mypageInfo(getByUserIdDto : GetByUserIdDto,transcationEntityManager:any) : Promise<ListMypageDto> {
    try {
      // console.log(' %%%  ===> ' + mypageDto.userId);
      // const result = this.userRepository
      //   .createQueryBuilder('user')
      //   .select([
      //     'user.userId',
      //     'user.userName',
      //     'user.userNickname',
      //     'user.userType',
      //     'user.userLoginType',
      //     'user.userPoint',
      //   ])
      //   .where('user.userId = :id', { id: getByUserIdDto.userId })
      //   .getOne();

      // return result;

      return await this.mypageRepository.mypageInfo(getByUserIdDto);
    } catch (e) {
      throw new ReadFail(e.stack)
    }
  }

  async mypageUpdate(updateMypageDto: UpdateMypageDto, file: Express.Multer.File) {
    try {
      let getByUserIdDto = new GetByUserIdDto()
      getByUserIdDto.userId = updateMypageDto.userId
      const userObj: User = await this.userInfo(getByUserIdDto);
      //file 체크
      if (file) {
        // console.log(file, '------file-------')
        // console.log('location ' + file.location);
        const { location, key } = file;
        updateMypageDto.userImage = location;
      }
      let setObj = {};
      for (const [key, value] of Object.entries(userObj)) {
        if (updateMypageDto[key] !== value) {
          setObj[key] = updateMypageDto[key];
        }
      }
      const comparePw = await bcrypt.compare(
        updateMypageDto.userPwd,
        userObj.userPwd,
      );

      if (comparePw) {
        delete setObj['userPwd'];
      }

      //하나라도 수정 된경우
      if (JSON.stringify(setObj) !== '{}') {
        console.log('modify ' + JSON.stringify(setObj));
        // const result = await this.userRepository
        //   .createQueryBuilder('user')
        //   .select()
        //   .update()
        //   .set({
        //     ...setObj,
        //   })
        //   .where('userId = :id', { id: updateMypageDto.userId })
        //   .execute();
        const result = await this.mypageRepository.mypageUpdate(updateMypageDto,setObj);
      }
    } catch (e) {
      // console.log(error);
      throw new UpdateFail(e.stack)
    }
  }

  //회원 탈퇴
  async mypageDelete(deleteMypageDto: DeleteMypageDto) {
    try {
      //현 비밀번호 조회
      let getByUserIdDto = new GetByUserIdDto()
      getByUserIdDto.userId = deleteMypageDto.userId
      const userData: User = await this.userInfo(getByUserIdDto);
      //입력한 비밀번호 비교
      const checkPwd = await bcrypt.compare(
        deleteMypageDto.userPwd,
        userData.userPwd,
      );
      if (!checkPwd) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }
        // await this.userRepository
        // .createQueryBuilder('user')
        // .delete()
        // .from(User)
        // .where('user.userId = :id', { id: deleteMypageDto.userId })
        // .execute();
        await this.mypageRepository.mypageDelete(deleteMypageDto);
      return '계정이 삭제되었습니다.';
    } catch (e) {
      throw new DeleteFail(e.stack)
    }
  }

  //
  async userInfo(getByUserIdDto: GetByUserIdDto) {
    console.log(' %%%  ===> ' + getByUserIdDto.userId);

    
    // const result = await this.userRepository
    //   .createQueryBuilder('user')
    //   .select(['user.userPwd', 'user.userImage', 'user.userNickname'])
    //   .where('user.userId = :id', { id: getByUserIdDto.userId })
    //   .getOne();
    // return result;
    return await this.mypageRepository.userInfo(getByUserIdDto);
  }

  // async fileDonwload(@Res() res: Response, mypageDto: mypageDto) {
  //   const result = await this.userRepository
  //     .createQueryBuilder('user')
  //     .select(['user.userImage'])
  //     .where('user.userId = :id', { id: mypageDto.userId })
  //     .getOne();
  //   // console.log(result.userImage);

  //   if (result.userImage) {
  //     const stm = createReadStream(path.join(process.cwd(), result.userImage));
  //     return new StreamableFile(stm);
  //   }
  // }

  // async uploadFile(file: Express.Multer.File) {
  //   console.log(file);
  //   const { filename, originalname, mimetype, size, path } = file;

  //   if (!file) {
  //     throw new Error('file 없음');
  //   }
  //   return { filePath: file.path };
  // }

  async nickNamecheck(updateMypageDto: UpdateMypageDto) {
    // const result = await this.userRepository
    //   .createQueryBuilder('user')
    //   .select('COUNT(*) as count')
    //   .where('user.userNickname =:nickname', {
    //     nickname: updateMypageDto.userNickname,
    //   })
    //   .andWhere('user.userId != :id', { id: updateMypageDto.userId })
    //   .getRawOne();
    // return result;
    return this.mypageRepository.userInfo(updateMypageDto);
  }
}