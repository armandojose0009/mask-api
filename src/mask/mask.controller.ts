import {
  Controller,
  Post,
  Body,
  Get,
  HttpException,
  HttpStatus,
  Logger,
} from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { MaskService } from "./mask.service";
import { MaskRequestDto, MaskResponseDto } from "./dto/mask.dto";
import {
  InvalidInputException,
  DatabaseConnectionException,
  CacheConnectionException,
} from "./exceptions/mask.exceptions";

@ApiTags("mask")
@Controller("mask")
export class MaskController {
  private readonly logger = new Logger(MaskController.name);

  constructor(private readonly maskService: MaskService) {}

  @Post()
  @ApiOperation({ summary: "Mask string keeping last 4 characters" })
  @ApiResponse({
    status: 200,
    description: "String masked successfully",
    type: MaskResponseDto,
  })
  @ApiResponse({ status: 400, description: "Invalid input provided" })
  @ApiResponse({ status: 503, description: "Service unavailable" })
  async maskString(
    @Body() maskRequestDto: MaskRequestDto
  ): Promise<MaskResponseDto> {
    try {
      const result = await this.maskService.maskString(maskRequestDto.input);
      return { result };
    } catch (error) {
      this.logger.error("Error in maskString endpoint", error);

      if (error instanceof InvalidInputException) {
        throw error;
      }

      if (
        error instanceof DatabaseConnectionException ||
        error instanceof CacheConnectionException
      ) {
        throw error;
      }

      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get("history")
  @ApiOperation({ summary: "Get masking history" })
  @ApiResponse({ status: 200, description: "History retrieved successfully" })
  @ApiResponse({ status: 503, description: "Database service unavailable" })
  async getHistory() {
    try {
      return await this.maskService.getHistory();
    } catch (error) {
      this.logger.error("Error in getHistory endpoint", error);

      if (error instanceof DatabaseConnectionException) {
        throw error;
      }

      throw new HttpException(
        "Internal server error",
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}
