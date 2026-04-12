import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { RegionService } from './region.service';
import { RegionController } from './region.controller';

@Module({
  imports: [HttpModule],
  controllers: [RegionController],
  providers: [RegionService],
  exports: [RegionService],
})
export class RegionModule {}
