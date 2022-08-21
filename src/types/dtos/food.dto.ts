import { IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'
import { SaleType } from '../enums/food.enum'
import { Spec } from '../interfaces/spec.interface'

export class FoodDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  public name: string;

  @IsString()
  public imgUrl: string;

  @IsString()
  public description: string;

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

  @Reflect.metadata('design:type', { name: 'string' })
  @IsEnum(SaleType)
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

export class FoodQueryDto {
  @IsBoolean()
  @IsOptional()
  public isDeleted: boolean;

  @IsNumberString()
  @IsOptional()
  page?: String;

  @IsNumberString()
  @IsOptional()
  size?: String;

  @IsString()
  @IsOptional()
  orderby: String;
}
