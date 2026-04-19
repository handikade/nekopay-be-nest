import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxController } from './tax.controller';
import { TaxRepository } from './tax.repository';
import { TaxService } from './tax.service';

@Module({
  imports: [PrismaModule],
  controllers: [TaxController],
  providers: [TaxService, TaxRepository],
  exports: [TaxService, TaxRepository],
})
export class TaxModule {}
