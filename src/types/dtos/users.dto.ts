import { IsString, IsOptional, IsPhoneNumber } from 'class-validator'
import { Address } from '@/types/interfaces/address.interface'

export class UserDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  public password: string;

  @IsPhoneNumber('CH')
  public phoneNumber: string;

  @IsOptional()
  addresses: Address[]
}

export class LoginDto {
  @IsPhoneNumber('CH')
  public phoneNumber: string;

  @IsString()
  public password: string;
}
