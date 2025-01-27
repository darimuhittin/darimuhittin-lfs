import { IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetReservationsDto {
  @ApiProperty({
    example: '2024-01-01',
    description: 'Start date for filtering reservations (YYYY-MM-DD)',
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({
    example: '2024-12-31',
    description: 'End date for filtering reservations (YYYY-MM-DD)',
  })
  @IsDateString()
  endDate: string;
}
