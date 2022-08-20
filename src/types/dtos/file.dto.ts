import { Media } from '@/types/enums/file.enum'
import { IsBoolean, IsEnum, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, IsUrl } from 'class-validator'

export class FileDto {
  @IsString()
  public filename: string;

  @IsString()
  public originName: string;

  @Reflect.metadata('design:type', { name: 'string' })
  @IsEnum(Media)
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

  @Reflect.metadata('design:type', { name: 'string' })
  @IsEnum(Media)
  @IsOptional()
  fileType?: Media

  @IsNumberString()
  @IsOptional()
  page?: String;

  @IsNumberString()
  @IsOptional()
  size?: String;

  @IsString()
  @IsOptional()
  orderby: String;
}

export class FileRemoteAddressDto {
  @IsUrl()
  public url: string;
}
