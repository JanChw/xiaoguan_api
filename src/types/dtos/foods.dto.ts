import { IsArray, IsBoolean, IsDate, IsIn, IsNumber, IsObject, IsOptional, IsString, ValidateIf } from 'class-validator'
import { SaleType } from '../enums/food.enum'
import { Spec } from '../interfaces/specs.interface'

export class FoodDto {
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

  // @ValidateIf(n => n && !Number.isNaN(Number(n)))
  @IsNumber()
  @IsOptional()
  discount: number;

  // @ValidateIf(n => n && !Number.isNaN(Number(n)))
  @IsNumber()
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

export class BatchUpdateFoodsDto {
  @IsArray()
  ids: number[];

  @IsObject()
  payload: Partial<FoodDto>
}
