import { SaleType } from '../enums/food.enum'
import { Spec } from './specs.interface'
export interface Food {

  imgUrl: string;

  name: string;

  desc: string;

  detail: string;

  specs?: Spec[];

  discount?: number;

  originPrice?: number;

  isPublished?: boolean;

  saleType?: SaleType;

  images?: File[]
}

export interface FoodPartial {
  imgUrl?: string;

  name?: string;

  desc?: string;

  detail?: string;

  originPrice?: number;

  isPublished?: boolean;

  saleType?: SaleType;

  images?: File[]
}