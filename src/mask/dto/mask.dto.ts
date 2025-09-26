import { ApiProperty } from "@nestjs/swagger";
import { IsString, IsNotEmpty, MaxLength } from "class-validator";

export class MaskRequestDto {
  @ApiProperty({ example: "455636460793561" })
  @IsString()
  @IsNotEmpty()
  @MaxLength(1000)
  input: string;
}

export class MaskResponseDto {
  @ApiProperty({ example: "###########5616" })
  result: string;
}
