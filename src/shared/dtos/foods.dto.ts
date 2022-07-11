import { IsBoolean, IsIn, IsNumber, IsOptional, IsString } from 'class-validator'
import { SaleType } from '../enums/food.enum'
import { Spec } from '../interfaces/specs.interface'

export class CreateFoodDto {
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

  @IsNumber()
  @IsOptional()
  public originPrice: number;

  @IsBoolean()
  @IsOptional()
  public isPublished: boolean;

  @IsIn(['OFFLINE', 'ONLINE', 'BOTH'])
  @IsOptional()
  public saleType: SaleType
}
