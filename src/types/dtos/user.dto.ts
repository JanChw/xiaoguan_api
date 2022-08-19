import { IsString, IsOptional, IsPhoneNumber } from 'class-validator'
import { Address } from '@/types/interfaces/address.interface'

export class UserDto {
  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  public password: string;

  @IsPhoneNumber('CH')
  public phone: string;

  @IsOptional()
  addresses: Address[]
}

export class LoginDto {
  @IsPhoneNumber('CH')
  public phone: string;

  @IsString()
  public password: string;
}
