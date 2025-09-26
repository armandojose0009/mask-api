import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { MaskRecord } from "./schemas/mask-record.schema";
import { CacheService } from "./cache.service";
import {
  DatabaseConnectionException,
  InvalidInputException,
} from "./exceptions/mask.exceptions";

@Injectable()
export class MaskService {
  private readonly logger = new Logger(MaskService.name);

  constructor(
    @InjectModel(MaskRecord.name) private maskRecordModel: Model<MaskRecord>,
    private cacheService: CacheService
  ) {}

  async maskString(input: string): Promise<string> {
    try {
      if (input === null || input === undefined) {
        throw new InvalidInputException("Input cannot be null or undefined");
      }

      if (typeof input !== "string") {
        throw new InvalidInputException("Input must be a string");
      }

      if (!input || input.length <= 4) {
        return input;
      }

      const cacheKey = `mask:${input}`;
      let cached: string | null = null;

      try {
        cached = await this.cacheService.get(cacheKey);
      } catch (error) {
        this.logger.warn("Cache unavailable, proceeding without cache");
      }

      if (cached) {
        return cached;
      }

      const lastFour = input.slice(-4);
      const masked = "#".repeat(input.length - 4);
      const result = masked + lastFour;

      try {
        await this.cacheService.set(cacheKey, result);
      } catch (error) {
        this.logger.warn("Failed to cache result");
      }

      try {
        await this.maskRecordModel.create({ input, output: result });
      } catch (error) {
        this.logger.error("Database save failed", error);
        throw new DatabaseConnectionException();
      }

      return result;
    } catch (error) {
      if (
        error instanceof InvalidInputException ||
        error instanceof DatabaseConnectionException
      ) {
        throw error;
      }
      this.logger.error("Unexpected error in maskString", error);
      throw new Error("Internal server error");
    }
  }

  async getHistory() {
    try {
      return await this.maskRecordModel
        .find()
        .sort({ createdAt: -1 })
        .limit(100);
    } catch (error) {
      this.logger.error("Database query failed", error);
      throw new DatabaseConnectionException();
    }
  }
}
