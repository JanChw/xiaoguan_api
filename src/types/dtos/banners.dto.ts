import { IsObject, IsOptional, IsString } from 'class-validator'
import { File } from '../interfaces/files.interface'

export class BannerDto {
  @IsString()
  public name: string;

  @IsObject()
  public links: object;

  // @IsOptional()
  // public imgs: File[]
}
