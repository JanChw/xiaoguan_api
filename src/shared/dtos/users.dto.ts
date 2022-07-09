import { IsEmail, IsString, IsOptional } from 'class-validator'

export class CreateUserDto {
  @IsEmail()
  public email: string;

  @IsString()
  public password: string;
}

export class UpdateUserPartialDto {
  @IsEmail()
  @IsOptional()
  public email: string;

  @IsString()
  @IsOptional()
  public password: string;

  @IsString()
  @IsOptional()
  public name: string;
}
