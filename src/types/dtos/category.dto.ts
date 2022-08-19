import { IsInt, IsNotEmpty, IsOptional, IsString } from 'class-validator'

export class CategoryDto {
  @IsInt()
  @IsOptional()
  pid: Number;

  @IsString()
  @IsNotEmpty()
  name: String;
}
