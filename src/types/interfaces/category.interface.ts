import { Food } from './food.interface'
export interface Category {
  id: string;

  pid: number;

  name: string;

  foods?: Food[];
}
