import { IsNumberString, IsOptional, IsString } from 'class-validator'

export class PaginationAndOrderByDto {
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
