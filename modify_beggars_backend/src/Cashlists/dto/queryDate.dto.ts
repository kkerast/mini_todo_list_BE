import { ApiProperty } from '@nestjs/swagger';

export class QueryDate {
  @ApiProperty({
    example: '2023-07-01',
  })
  public date: Date;
}
