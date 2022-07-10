import { IsString } from 'class-validator'

export class CreateBucketDto {
  @IsString()
  public name: string;
}
