import { IsNumberString, IsOptional, IsString, ValidateIf } from 'class-validator'

export class PaginationAndOrderByDto {
  @IsNumberString()
  @IsOptional()
  page: String;

  @IsNumberString()
  @IsOptional()
  size: String;

  @IsString()
  @ValidateIf(o => o.orderby && o.orderby.includes(':'))
  @IsOptional()
  orderby: String;
}
