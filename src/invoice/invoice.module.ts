import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { InvoiceRepository } from './invoice.repository';

@Module({
  imports: [PrismaModule],
  providers: [InvoiceRepository],
  exports: [InvoiceRepository],
})
export class InvoiceModule {}
