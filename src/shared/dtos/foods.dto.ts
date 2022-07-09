import { IsOptional, IsString } from 'class-validator'
import { Spec } from '../interfaces/specs.interface'
export class CreateFoodDto {
  @IsString()
  public imgUrl: string;

  @IsString()
  public name: string;

  @IsString()
  public desc: string;

  @IsString()
  public detail: string;

  @IsOptional()
  public specs: Spec[];
}

export class UpdateFoodPartialDto {
  @IsString()
  @IsOptional()
  public imgUrl: string;

  @IsString()
  @IsOptional()
  public name: string;

  @IsString()
  @IsOptional()
  public desc: string;

  @IsString()
  @IsOptional()
  public detail: string;

  // @IsNumber()
  // public originPrice?: number;

  // @IsBoolean()
  // public isPublished?: boolean;

  // @IsIn([0, 1, 2])
  // public saleType?: SaleType
}
