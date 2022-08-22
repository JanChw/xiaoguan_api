import { IsEnum, IsNumberString, IsOptional, IsString, Length, MaxLength, ValidateIf } from 'class-validator'
import { PaymentStatus } from '../enums/order.enum'

export class OrderDto {
  @IsString()
  @Length(19, 19)
  code: String;
}

export class OrderQueryDto {
  @IsString()
  @MaxLength(19)
  @IsOptional()
  code: String;

  @Reflect.metadata('design:type', { name: 'string' })
  @IsEnum(PaymentStatus)
  @IsOptional()
  status: PaymentStatus

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
