import { IsNotEmpty, IsObject, IsOptional, IsString } from 'class-validator'
import { File } from '../interfaces/files.interface'

export class BannerDto {
  @IsString()
  @IsNotEmpty()
  public name: string;

  @IsObject()
  public links: object;

  @IsOptional()
  public imgs: Partial<File>[]
}
