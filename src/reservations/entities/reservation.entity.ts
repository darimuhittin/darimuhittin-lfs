export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Reservation {
  id?: string;
  flightNumber: string;
  departure: Airport;
  arrival: Airport;
  date: string;
  customers: Customer[];
  aiSuggestions?: string[];
  notes?: string;
}

export interface Airport {
  name: string;
  iata: string;
  city: string;
}
