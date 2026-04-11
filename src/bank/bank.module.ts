import { Module } from '@nestjs/common';
import { BankService } from './bank.service';
import { BankController } from './bank.controller';
import { BankRepository } from './bank.repository';

@Module({
  controllers: [BankController],
  providers: [BankService, BankRepository],
  exports: [BankService, BankRepository],
})
export class BankModule {}
