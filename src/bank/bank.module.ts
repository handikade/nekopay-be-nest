import { Module } from '@nestjs/common';
import { BankController } from './bank.controller';
import { BankRepository } from './bank.repository';
import { BankService } from './bank.service';

@Module({
  controllers: [BankController],
  providers: [BankService, BankRepository],
  exports: [BankService, BankRepository],
})
export class BankModule {}
