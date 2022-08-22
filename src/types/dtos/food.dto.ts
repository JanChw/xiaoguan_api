import { IsArray, IsBoolean, IsDate, IsEnum, IsIn, IsNotEmpty, IsNumber, IsNumberString, IsObject, IsOptional, IsString } from 'class-validator'
import { SaleType } from '../enums/food.enum'
import { Spec } from '../interfaces/spec.interface'

export class FoodDto {
  @IsNumber()
  @IsOptional()
  id: number;

  @IsString()
  name: string;

  @IsString()
  imgUrl: string;

  @IsString()
  description: string;

  @IsString()
  detail: string;

  @IsOptional()
  specs: Spec[];

  // @ValidateIf(n => n && !Number.isNaN(Number(n)))
  @IsNumber()
  @IsOptional()
  discount: number;

  // @ValidateIf(n => n && !Number.isNaN(Number(n)))
  @IsNumber()
  @IsOptional()
  originPrice: number;

  @IsBoolean()
  @IsOptional()
  isPublished: boolean;

  @Reflect.metadata('design:type', { name: 'string' })
  @IsEnum(SaleType)
  @IsOptional()
  saleType: SaleType;

  @IsBoolean()
  @IsOptional()
  isDeleted: boolean;

  @IsDate()
  @IsOptional()
  createdAt: Date;
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
  isDeleted: boolean;

  @IsString()
  @IsNotEmpty()
  @IsOptional()
  content: string;

  @IsNumberString()
  @IsOptional()
  page: string;

  @IsNumberString()
  @IsOptional()
  size: string;

  @IsString()
  @IsOptional()
  orderby: string;
}
