import { IsBoolean, IsDate, IsIn, IsNumber, IsNumberString, IsOptional, IsString } from 'class-validator'
import { SaleType } from '../enums/food.enum'
import { Spec } from '../interfaces/specs.interface'

export class CreateFoodDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  public name: string;

  @IsString()
  public imgUrl: string;

  @IsString()
  public desc: string;

  @IsString()
  public detail: string;

  @IsOptional()
  public specs: Spec[];

  @IsNumberString()
  @IsOptional()
  discount: number;

  @IsNumberString()
  @IsOptional()
  public originPrice: number;

  @IsBoolean()
  @IsOptional()
  public isPublished: boolean;

  @IsIn(['OFFLINE', 'ONLINE', 'BOTH'])
  @IsOptional()
  public saleType: SaleType;

  @IsBoolean()
  @IsOptional()
  public isDeleted: boolean;

  @IsDate()
  @IsOptional()
  public createdAt: Date;
}
