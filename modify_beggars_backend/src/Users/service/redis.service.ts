import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Injectable, Inject} from '@nestjs/common';
import { Cache } from 'cache-manager'
import TokenDto from '../dto/token.dto';
import { CreateFail, DeleteFail, ReadFail } from 'src/Utils/exception.service';

@Injectable()
export class RedisService {
  constructor(
        //private readonly httpService: HttpService,
        @Inject(CACHE_MANAGER) private cacheManager : Cache
  ) {}

    async getRefresh(userName : string) {
      try {
        const value = await this.cacheManager.get(userName);
        return value
      } catch(e) {
        throw new ReadFail(e.stack)
      }
    }

    async getCode(code : string) {
      try {
        console.log('Service - code -- ',code)
        const value : TokenDto = await this.cacheManager.get(code);
        console.log('value -- value', value)
        return value
      } catch(e) {
        throw new ReadFail(e.stack)
      }
  }

    async setRefresh(userName : string, refreshToken : string) {
        try {
          await this.cacheManager.set(userName,refreshToken)
        } catch(e) {
          throw new CreateFail(e.stack)
        }
    }

    async setCode(key : string, value : any) {
      try {
        await this.cacheManager.set(key,value,1000000)
        const result = await this.cacheManager.get(key)
        console.log(result, '--setCode')
      } catch(e) {
        throw new CreateFail(e.stack)
      }
    }

    async deleteRefresh(key : string) {
      try {
        await this.cacheManager.del(key)

      } catch(e) {
        throw new DeleteFail(e.stack)
      }
    }
    
  
}
