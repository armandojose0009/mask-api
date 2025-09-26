import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

@Schema({ timestamps: true })
export class MaskRecord extends Document {
  @Prop({ required: true })
  input: string;

  @Prop({ required: true })
  output: string;
}

export const MaskRecordSchema = SchemaFactory.createForClass(MaskRecord);
