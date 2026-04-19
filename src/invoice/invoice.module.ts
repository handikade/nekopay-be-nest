import { Module } from '@nestjs/common';
import { PartnerModule } from '../partner/partner.module';
import { PrismaModule } from '../prisma/prisma.module';
import { TaxModule } from '../tax/tax.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceRepository } from './invoice.repository';
import { InvoiceService } from './invoice.service';

@Module({
  imports: [PrismaModule, PartnerModule, TaxModule],
  controllers: [InvoiceController],
  providers: [InvoiceRepository, InvoiceService],
  exports: [InvoiceRepository, InvoiceService],
})
export class InvoiceModule {}
