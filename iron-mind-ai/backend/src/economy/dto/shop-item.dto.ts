import { IsString, IsNotEmpty } from 'class-validator';

export class ShopItemDto {
  @IsString()
  @IsNotEmpty()
  itemId!: string;
}
