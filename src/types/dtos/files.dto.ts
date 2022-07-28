import { Media } from '@/types/enums/files.enum'
import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'

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

  @IsBoolean()
  @IsOptional()
  public isCollected: boolean;
}

export class FileOptionalInfoDto {
  @IsBoolean()
  public isCollected: boolean;
}
