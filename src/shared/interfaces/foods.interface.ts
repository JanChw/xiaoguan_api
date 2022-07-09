import { SaleType } from '../enums/food.enum'

export interface Food {
  imgUrl: string;

  name: string;

  desc: string;

  detail: string;

  originPrice?: number;

  isPublished?: boolean;

  saleType?: SaleType;
}

export interface FoodPartial {
  imgUrl?: string;

  name?: string;

  desc?: string;

  detail?: string;

  originPrice?: number;

  isPublished?: boolean;

  saleType?: SaleType;
}
