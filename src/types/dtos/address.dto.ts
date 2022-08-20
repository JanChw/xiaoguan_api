import { IsBoolean, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'

export class AddressDto {
  @IsNumber()
  userId: Number

  @IsString()
  address: String;

  @IsBoolean()
  @IsOptional()
  isDefault: Boolean;
}

export class SearchAddressDto {
  @IsString()
  address: String;

  @IsNumberString()
  @IsOptional()
  page: String

  @IsNumberString()
  @IsOptional()
  size: String

  @IsString()
  @IsOptional()
  orderby: String
}
