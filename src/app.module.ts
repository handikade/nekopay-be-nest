import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { HealthModule } from './health/health.module';
import { PartnerModule } from './partner/partner.module';
import { PrismaModule } from './prisma/prisma.module';
import { BankModule } from './bank/bank.module';
import { RegionModule } from './region/region.module';

@Module({
  imports: [PrismaModule, AuthModule, HealthModule, PartnerModule, BankModule, RegionModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
