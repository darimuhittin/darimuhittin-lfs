import {
  IsString,
  IsDateString,
  IsArray,
  IsOptional,
  IsEmail,
  IsPhoneNumber,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

class CustomerDto {
  @ApiProperty()
  @IsString()
  id: string;

  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  passport: string;

  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsPhoneNumber()
  phone: string;
}

export class CreateReservationDto {
  @ApiProperty({ example: '2024-01-25' })
  @IsDateString()
  date: string;

  @ApiProperty({ example: 'TK1234' })
  @IsString()
  flightNumber: string;

  @ApiProperty({ example: '2024-01-25T10:00:00Z' })
  @IsDateString()
  departure: string;

  @ApiProperty({ example: '2024-01-25T14:00:00Z' })
  @IsDateString()
  arrival: string;

  @ApiProperty({ type: [CustomerDto] })
  @IsArray()
  customers: CustomerDto[];

  @ApiProperty({ example: ['Meal preference: Vegetarian'] })
  @IsArray()
  aiSuggestions: string[];

  @ApiProperty({ example: 'Special assistance required' })
  @IsString()
  @IsOptional()
  notes?: string;
}
