import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator'

export class AddressDto {
  @IsNumber()
  userId: Number

  @IsString()
  address: String;

  @IsBoolean()
  @IsOptional()
  isDefault: Boolean;
}
