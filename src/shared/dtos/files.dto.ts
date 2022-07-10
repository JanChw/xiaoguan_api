import { Media } from '@/shared/enums/files.enum'
import { IsIn, IsOptional, IsString } from 'class-validator'

export class CreateFileDto {
  @IsString()
  public filename: string;

  @IsString()
  public originName: string;

  @IsIn([0, 1, 2, 3])
  public fileType: Media;

  @IsString()
  public url: string;

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
