import { ApiProperty } from '@nestjs/swagger';

export class BankDto {
  @ApiProperty({
    description: 'Bank unique identifier',
    example: 'd5df554d-4425-4cc4-8333-5e057cca9135',
  })
  id!: string;

  @ApiProperty({ description: 'Bank code', example: 'BCA' })
  code!: string;

  @ApiProperty({ description: 'Bank name', example: 'Bank Central Asia' })
  name!: string;

  @ApiProperty({ description: 'Creation timestamp' })
  created_at!: Date;

  @ApiProperty({ description: 'Last update timestamp' })
  updated_at!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 100 })
  total!: number;

  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 10 })
  totalPages!: number;
}

export class PaginatedBanksResponseDto {
  @ApiProperty({ type: [BankDto] })
  data!: BankDto[];

  @ApiProperty()
  meta!: PaginationMetaDto;
}
