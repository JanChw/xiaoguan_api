import { IsNumber, IsOptional, IsString } from 'class-validator'

export class ResourceDto {
  @IsNumber()
  @IsOptional()
  public pid: number;

  @IsString()
  @IsOptional()
  public title: string;

  @IsString()
  permission: string;

  @IsString()
  @IsOptional()
  path: string;
}
