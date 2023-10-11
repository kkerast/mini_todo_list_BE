import {
    CallHandler,
    ExecutionContext,
    HttpException,
    Injectable,
    InternalServerErrorException,
    NestInterceptor,
  } from '@nestjs/common';
import { Connection } from 'mysql2';
import { Observable } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { DataSource } from 'typeorm';
  
  @Injectable()
  export class TranscationInterceptor implements NestInterceptor {
    constructor(private connection: Connection, private dataSource: DataSource) {}
    async intercept(context: ExecutionContext, next: CallHandler): Promise<Observable<any>> {
        
        console.log(`transaction start`);
        const ctx = context.switchToHttp();
        const request = ctx.getRequest();
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.startTransaction();
        request.manager = queryRunner.manager;
        
        return next.handle().pipe(
            catchError(async (err)=>{
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
                if (err instanceof HttpException) {
                    throw new HttpException(err.getResponse(), err.getStatus());
                } else {
                    throw new InternalServerErrorException();
                }
            }),tap(async()=> {
            
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }),
        )
    //   return next
    //     .handle()
    //     .pipe(tap(() => console.log(`tansaction out`)));
    }
  }

