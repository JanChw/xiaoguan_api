import { IsBoolean, IsOptional, IsString } from 'class-validator'

export class BucketDto {
  @IsString()
  public name: string;

  @IsBoolean()
  @IsOptional()
  public isDefault: boolean;
}
