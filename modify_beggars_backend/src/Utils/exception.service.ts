import { HttpException } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common/enums';


export class ErrorService extends Error {
  constructor(stack?, message?, name?) {
    super();
    (this.stack = stack), (this.message = message), (this.name = name)   
  }
}

export class UpdateFail extends ErrorService {
  constructor(stack,message='데이터 업데이트에 실패했습니다') {
    super(stack,message, HttpStatus.INTERNAL_SERVER_ERROR);
  } 

}

export class DeleteFail extends ErrorService {
  constructor(stack,message='데이터 삭제에 실패했습니다') {
    super(stack,message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ReadFail extends ErrorService {
  constructor(stack,message='데이터 불러오기에 실패했습니다') {
    super(stack,message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class CreateFail extends ErrorService {
  constructor(stack,message='데이터 생성에 실패했습니다') {
    super(stack,message, HttpStatus.INTERNAL_SERVER_ERROR);
  }
}