import { Injectable } from '@nestjs/common';
import { FirestoreService } from '../firestore/firestore.service';
import {
  CollectionReference,
  Query,
  DocumentData,
} from '@google-cloud/firestore';
import { GetReservationsDto } from './dto/get-reservations.dto';
import { CreateReservationDto } from './dto/create-reservation.dto';
import { UpdateReservationDto } from './dto/update-reservation.dto';

interface Reservation {
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
  departure: {
    iata: string;
  };
  arrival: {
    iata: string;
  };
}

@Injectable()
export class ReservationsService {
  private readonly RESERVATIONS_COLLECTION = 'reservations';

  constructor(private readonly firestoreService: FirestoreService) {}

  async getReservations(query: {
    startDate?: string;
    endDate?: string;
    page?: number;
    limit?: number;
    customerName?: string;
    flightNumber?: string;
    departureIata?: string;
    arrivalIata?: string;
    status?: string;
  }) {
    const {
      startDate,
      endDate,
      page = 1,
      limit = 5,
      customerName,
      flightNumber,
      departureIata,
      arrivalIata,
      status,
    } = query;

    let reservationsQuery: Query<DocumentData> = this.firestoreService
      .collection(this.RESERVATIONS_COLLECTION)
      .orderBy('departureDate', 'asc');

    if (startDate) {
      reservationsQuery = reservationsQuery.where(
        'departureDate',
        '>=',
        startDate,
      );
    }
    if (endDate) {
      reservationsQuery = reservationsQuery.where(
        'departureDate',
        '<=',
        endDate,
      );
    }

    // Get all documents for in-memory filtering
    let snapshot = await reservationsQuery.get();
    let reservations = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    })) as Reservation[];

    // Apply all other filters in memory
    if (flightNumber) {
      reservations = reservations.filter(
        (r) => r.flightNumber === flightNumber,
      );
    }
    if (departureIata) {
      reservations = reservations.filter(
        (r) => r.departure.iata === departureIata.toUpperCase(),
      );
    }
    if (arrivalIata) {
      reservations = reservations.filter(
        (r) => r.arrival.iata === arrivalIata.toUpperCase(),
      );
    }
    if (status && status !== 'all') {
      reservations = reservations.filter((r) => r.status === status);
    }
    if (customerName) {
      const searchTerm = customerName.toLowerCase();
      reservations = reservations.filter((reservation) =>
        reservation.customers.some((customer) =>
          customer.name.toLowerCase().includes(searchTerm),
        ),
      );
    }

    // Calculate total after filtering but before pagination
    const total = reservations.length;

    // Apply pagination in memory
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    reservations = reservations.slice(startIndex, endIndex);

    return {
      data: reservations,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async getReservationById(id: string): Promise<Reservation | null> {
    const doc = await this.firestoreService.findOne(
      this.RESERVATIONS_COLLECTION,
      id,
    );
    if (!doc) {
      return null;
    }
    return {
      id: doc.id,
      ...doc,
    } as Reservation;
  }

  async getAiSuggestions(id: string): Promise<string[]> {
    const reservation = await this.getReservationById(id);
    if (!reservation) {
      return [];
    }
    return reservation.aiSuggestions || [];
  }

  async createReservation(createReservationDto: CreateReservationDto) {
    const docRef = await this.firestoreService.create(
      this.RESERVATIONS_COLLECTION,
      createReservationDto,
    );
    return this.getReservationById(docRef.id);
  }

  async updateReservation(
    id: string,
    updateReservationDto: UpdateReservationDto,
  ) {
    await this.firestoreService.update(
      this.RESERVATIONS_COLLECTION,
      id,
      updateReservationDto,
    );
    return this.getReservationById(id);
  }

  async deleteReservation(id: string) {
    await this.firestoreService.delete(this.RESERVATIONS_COLLECTION, id);
    return { success: true };
  }
}
