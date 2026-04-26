import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { BankModule } from './bank/bank.module';
import { HealthModule } from './health/health.module';
import { InvoiceModule } from './invoice/invoice.module';
import { PartnerModule } from './partner/partner.module';
import { PrismaModule } from './prisma/prisma.module';
import { RegionModule } from './region/region.module';
import { TaxModule } from './tax/tax.module';
import { UserModule } from './user/user.module';

@Module({
  imports: [
    PrismaModule,
    AuthModule,
    HealthModule,
    PartnerModule,
    BankModule,
    RegionModule,
    InvoiceModule,
    TaxModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
