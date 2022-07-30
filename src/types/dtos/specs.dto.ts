import { IsString, IsNumber, IsNumberString } from 'class-validator'

export class CreateSpecDto {
  @IsNumber()
  public foodId:number;

  @IsString()
  public name: string;

  @IsNumberString()
  public price: number | string;
}

// export class UpdateSpecPartialDto {
//   @IsString()
//   @IsOptional()
//   public name: string;

//   @IsNumber()
//   @IsOptional()
//   public price: number;
// }
