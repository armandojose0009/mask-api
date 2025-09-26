import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaskModule } from './mask/mask.module';

@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI || 'mongodb://localhost:27017/maskapi'),
    MaskModule
  ],
})
export class AppModule {}