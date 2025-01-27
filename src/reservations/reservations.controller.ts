import {
  Controller,
  Get,
  Query,
  Param,
  UseGuards,
  UnauthorizedException,
  Post,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ReservationsService } from './reservations.service';
import { JwtAuthGuard } from '@/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/auth/guards/roles.guard';
import { Roles } from '@/auth/decorators/roles.decorator';
import { UserRole } from '@/auth/entities/user.entity';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

export interface ReservationResponse {
  id: string;
  flightNumber: string;
  departureCity: string;
  arrivalCity: string;
  departureDate: string;
  arrivalDate: string;
  status: 'confirmed' | 'pending' | 'cancelled';
  customers: Array<{
    id: string;
    name: string;
    email: string;
    phone: string;
  }>;
  aiSuggestions: string[];
}

@ApiTags('Reservations')
@ApiBearerAuth()
@Controller('reservations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Get()
  @ApiOperation({
    summary:
      'Get reservations with pagination, date filtering, and advanced filters',
  })
  @ApiResponse({
    status: 200,
    description: 'Returns paginated list of reservations',
  })
  @ApiQuery({ name: 'startDate', required: false })
  @ApiQuery({ name: 'endDate', required: false })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'customerName', required: false })
  @ApiQuery({ name: 'flightNumber', required: false })
  @ApiQuery({ name: 'departureIata', required: false })
  @ApiQuery({ name: 'arrivalIata', required: false })
  @ApiQuery({ name: 'status', required: false })
  async getReservations(
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
    @Query('customerName') customerName?: string,
    @Query('flightNumber') flightNumber?: string,
    @Query('departureIata') departureIata?: string,
    @Query('arrivalIata') arrivalIata?: string,
    @Query('status') status?: string,
  ): Promise<{
    data: ReservationResponse[];
    meta: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  }> {
    return this.reservationsService.getReservations({
      startDate,
      endDate,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
      customerName,
      flightNumber,
      departureIata,
      arrivalIata,
      status,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get reservation by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns reservation details',
  })
  async getReservationById(
    @Param('id') id: string,
  ): Promise<ReservationResponse> {
    const reservation = await this.reservationsService.getReservationById(id);
    if (!reservation) {
      throw new UnauthorizedException('Reservation not found');
    }
    return reservation;
  }

  @Get(':id/suggestions')
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Get AI suggestions for a reservation' })
  @ApiResponse({
    status: 200,
    description: 'Returns AI-generated suggestions',
  })
  async getAiSuggestions(@Param('id') id: string): Promise<string[]> {
    return this.reservationsService.getAiSuggestions(id);
  }

  @Post()
  @Roles(UserRole.ADMIN)
  async createReservation(
    @Body() createReservationDto: CreateReservationDto,
  ): Promise<ReservationResponse> {
    return this.reservationsService.createReservation(createReservationDto);
  }

  @Put(':id')
  @Roles(UserRole.ADMIN)
  async updateReservation(
    @Param('id') id: string,
    @Body() updateReservationDto: UpdateReservationDto,
  ): Promise<ReservationResponse> {
    return this.reservationsService.updateReservation(id, updateReservationDto);
  }

  @Delete(':id')
  @Roles(UserRole.ADMIN)
  async deleteReservation(
    @Param('id') id: string,
  ): Promise<{ success: boolean }> {
    return this.reservationsService.deleteReservation(id);
  }
}
