import { IsString, IsNumber } from 'class-validator'

export class CreateSpecDto {
  @IsNumber()
  public foodId:number;

  @IsString()
  public name: string;

  @IsNumber()
  public price: number;
}
