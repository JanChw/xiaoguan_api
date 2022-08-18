import { Media } from '@/types/enums/files.enum'
import { IsBoolean, IsIn, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator'

export class FileDto {
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
  @IsOptional()
  public isCollected: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public originName?: string;

  @IsIn(['IMAGE', 'VEDIO', 'AUDIO', 'TEXT'])
  @IsOptional()
  fileType?: Media
}

export class FileRemoteAddressDto {
  @IsUrl()
  public url: string;
}
