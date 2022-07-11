import { IsString, IsOptional, IsNumber } from 'class-validator'

export class CreateSpecDto {
  @IsNumber()
  public foodId:number;

  @IsString()
  public name: string;

  @IsNumber()
  public price: number;
}

// export class UpdateSpecPartialDto {
//   @IsString()
//   @IsOptional()
//   public name: string;

//   @IsNumber()
//   @IsOptional()
//   public price: number;
// }
