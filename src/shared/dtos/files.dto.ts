import { Media } from '@/shared/enums/files.enum'
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateFileDto {
  @IsString()
  public filename: string;

  @IsString()
  public originName: string;

  @IsIn(['IMAGE', 'VEDIO', 'AUDIO', 'TEXT'])
  public fileType: Media;

  @IsString()
  public url: string;

  @IsNumber()
  public bucketId: number;

  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  @IsOptional()
  public desc: string;

  @IsString()
  @IsOptional()
  public link: string;
}
