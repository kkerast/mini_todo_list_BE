import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  MulterModuleOptions,
  MulterOptionsFactory,
} from '@nestjs/platform-express';
import * as AWS from 'aws-sdk';
import path from 'path';
const multerS3 = require('multer-s3')

@Injectable()  
export class MulterConfigService implements MulterOptionsFactory {
  uploadFolder: string = this.configService.get('UPLOAD_FOLDER');
  s3: any;
  constructor(private readonly configService: ConfigService) {
    this.s3 = new AWS.S3();

    AWS.config.update({
      region: configService.get('AWS_BUCKET_REGION') as string,
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID') as string,
        secretAccessKey: this.configService.get(
          'AWS_SECRET_ACCESS_KEY',
        ) as string,
      }, 
    });
  }

  createMulterOptions(): MulterModuleOptions {
    const bucket: string = this.configService.get('AWS_BUCKET_NAME');
    console.log('이거작동되나')
    //const acl: string = 'public-read';
    const multerStorage = multerS3({
      s3: this.s3,
      bucket,
      // acl,
      // meta: (req, file, cb) => {
      //   console.log('file.fieldName ' + file.fieldName);
      //   cb(null, { fieldName: file.fieldName });
      // },
      key: (req, file, cb) => {
        // 파일의 확장자 추출
        const filename = file.originalname
        const ext = path.extname(filename);
        const basename = path.basename(file.originalname, ext);
        // 파일 이름 중복방지위해 파일이름_날짜.확장자 형식으로 설정
        cb(null, `${this.uploadFolder}/${basename}_${Date.now()}${ext}`);
      },  
    }); 
    console.log('이거작동되나2')
    return { 
      storage: multerStorage,
      limits: {
        fileSize: 5 * 1024 * 1024, //5MB
        fieldNameSize: 100, //
      },
      // fileFilter: this.fileFilter,
    };
  }

  // public fileFilter(
  //   req: Express.Request,
  //   file: Multer.File,
  //   cb: (error: Error | null, acceptFile: boolean) => void,
  // ) {
  //   if (file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
  //     //파일 확장자는 jpg|jpeg|png
  //     cb(null, true);
  //   } else {
  //     cb(new Error('unsupported file'), false);
  //   }
  // }
}