import { IsNumber, IsOptional, IsString } from 'class-validator'

export class CreateServicesDto {
  @IsString()
  public name: String;

  @IsNumber()
  public price: Number;

  @IsString()
  @IsOptional()
  public image: String;

  @IsString()
  @IsOptional()
  public desc: String;

  @IsString()
  @IsOptional()
  public remark: String;
}
