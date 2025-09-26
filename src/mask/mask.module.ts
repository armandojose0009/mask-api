import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { MaskController } from "./mask.controller";
import { MaskService } from "./mask.service";
import { CacheService } from "./cache.service";
import { MaskRecord, MaskRecordSchema } from "./schemas/mask-record.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MaskRecord.name, schema: MaskRecordSchema },
    ]),
  ],
  controllers: [MaskController],
  providers: [MaskService, CacheService],
})
export class MaskModule {}
