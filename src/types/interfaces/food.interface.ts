import { SaleType } from '../enums/food.enum'
import { File } from './file.interface'
import { Spec } from './spec.interface'
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

  isDeleted: boolean;

  images?: File[]
}

export interface FoodQuery {

  isDeleted: boolean;

  content: string;

  page: string;

  size: string;

  orderby: string;
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
