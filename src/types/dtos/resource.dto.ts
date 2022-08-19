import { IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator'

export class ResourceDto {
  @IsNumber()
  @IsOptional()
  public pid: number;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  public title: string;

  @IsString()
  @IsNotEmpty()
  permission: string;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  path: string;
}
