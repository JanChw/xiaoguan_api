import { IsNotEmpty, IsNumberString, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator'
import { File } from '../interfaces/file.interface'

export class BannerDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsObject()
  public links: object;

  @IsOptional()
  public title: string;

  @IsOptional()
  public desc: string;

  @IsOptional()
  public imgs: Partial<File>[]
}

export class BannerQueryDto {
  @IsString()
  content: string;

  @IsNumberString()
  @IsOptional()
  page: string;

  @IsNumberString()
  @IsOptional()
  size: string;

  @IsString()
  @ValidateIf(o => o.orderby && o.orderby.includes(':'))
  @IsOptional()
  orderby: string;
}
