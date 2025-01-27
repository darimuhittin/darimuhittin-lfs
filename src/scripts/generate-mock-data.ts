// import { faker } from '@faker-js/faker';
// import * as admin from 'firebase-admin';
// import * as bcrypt from 'bcrypt';

// // Initialize Firebase Admin
// const serviceAccount = require('../../serviceAccountKey.json');
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

// const db = admin.firestore();

// interface Customer {
//   id: string;
//   name: string;
//   email: string;
//   phone: string;
// }

// interface Airport {
//   name: string;
//   iata: string;
//   city: string;
// }

// interface Reservation {
//   id: string;
//   flightNumber: string;
//   departure: Airport;
//   arrival: Airport;
//   departureDate: string;
//   arrivalDate: string;
//   status: 'confirmed' | 'pending' | 'cancelled';
//   customers: Customer[];
//   aiSuggestions: string[];
// }

// interface User {
//   id: string;
//   email: string;
//   password: string;
//   name: string;
//   role: 'admin' | 'staff';
// }

// // List of major airports for more realistic data
// const airports: Airport[] = [
//   // North America
//   {
//     name: 'John F. Kennedy International Airport',
//     iata: 'JFK',
//     city: 'New York',
//   },
//   {
//     name: 'Los Angeles International Airport',
//     iata: 'LAX',
//     city: 'Los Angeles',
//   },
//   { name: "O'Hare International Airport", iata: 'ORD', city: 'Chicago' },
//   {
//     name: 'Hartsfield-Jackson Atlanta International Airport',
//     iata: 'ATL',
//     city: 'Atlanta',
//   },
//   {
//     name: 'San Francisco International Airport',
//     iata: 'SFO',
//     city: 'San Francisco',
//   },
//   { name: 'Miami International Airport', iata: 'MIA', city: 'Miami' },
//   {
//     name: 'Toronto Pearson International Airport',
//     iata: 'YYZ',
//     city: 'Toronto',
//   },
//   { name: 'Vancouver International Airport', iata: 'YVR', city: 'Vancouver' },
//   {
//     name: 'Mexico City International Airport',
//     iata: 'MEX',
//     city: 'Mexico City',
//   },

//   // Europe
//   { name: 'Heathrow Airport', iata: 'LHR', city: 'London' },
//   { name: 'Paris Charles de Gaulle Airport', iata: 'CDG', city: 'Paris' },
//   { name: 'Amsterdam Airport Schiphol', iata: 'AMS', city: 'Amsterdam' },
//   { name: 'Frankfurt Airport', iata: 'FRA', city: 'Frankfurt' },
//   { name: 'Madrid-Barajas Airport', iata: 'MAD', city: 'Madrid' },
//   { name: 'Rome Fiumicino Airport', iata: 'FCO', city: 'Rome' },
//   { name: 'Munich Airport', iata: 'MUC', city: 'Munich' },
//   { name: 'Istanbul Airport', iata: 'IST', city: 'Istanbul' },
//   { name: 'Zurich Airport', iata: 'ZRH', city: 'Zurich' },

//   // Asia & Middle East
//   { name: 'Dubai International Airport', iata: 'DXB', city: 'Dubai' },
//   { name: 'Singapore Changi Airport', iata: 'SIN', city: 'Singapore' },
//   { name: 'Tokyo Haneda Airport', iata: 'HND', city: 'Tokyo' },
//   { name: 'Hong Kong International Airport', iata: 'HKG', city: 'Hong Kong' },
//   { name: 'Incheon International Airport', iata: 'ICN', city: 'Seoul' },
//   {
//     name: 'Beijing Capital International Airport',
//     iata: 'PEK',
//     city: 'Beijing',
//   },
//   {
//     name: 'Shanghai Pudong International Airport',
//     iata: 'PVG',
//     city: 'Shanghai',
//   },
//   { name: 'Taiwan Taoyuan International Airport', iata: 'TPE', city: 'Taipei' },
//   { name: 'Bangkok Suvarnabhumi Airport', iata: 'BKK', city: 'Bangkok' },
//   { name: 'Abu Dhabi International Airport', iata: 'AUH', city: 'Abu Dhabi' },
//   { name: 'Doha Hamad International Airport', iata: 'DOH', city: 'Doha' },

//   // Australia & Pacific
//   { name: 'Sydney Airport', iata: 'SYD', city: 'Sydney' },
//   { name: 'Melbourne Airport', iata: 'MEL', city: 'Melbourne' },
//   { name: 'Auckland Airport', iata: 'AKL', city: 'Auckland' },
//   { name: 'Brisbane Airport', iata: 'BNE', city: 'Brisbane' },

//   // South America
//   {
//     name: 'São Paulo/Guarulhos International Airport',
//     iata: 'GRU',
//     city: 'São Paulo',
//   },
//   { name: 'El Dorado International Airport', iata: 'BOG', city: 'Bogotá' },
//   { name: 'Jorge Chávez International Airport', iata: 'LIM', city: 'Lima' },
//   { name: 'Santiago International Airport', iata: 'SCL', city: 'Santiago' },
//   {
//     name: 'Buenos Aires Ezeiza International Airport',
//     iata: 'EZE',
//     city: 'Buenos Aires',
//   },
// ];

// // Generate mock customers
// function generateCustomer(): Customer {
//   return {
//     id: faker.string.uuid(),
//     name: faker.person.fullName(),
//     email: faker.internet.email(),
//     phone: faker.phone.number(),
//   };
// }

// // Generate mock reservations
// function generateReservation(): Reservation {
//   const departureDate = faker.date.future();
//   const arrivalDate = new Date(departureDate.getTime() + 2 * 60 * 60 * 1000); // 2 hours later

//   const numCustomers = faker.number.int({ min: 1, max: 3 });
//   const customers = Array.from({ length: numCustomers }, () =>
//     generateCustomer(),
//   );

//   // Select random airports ensuring departure != arrival
//   let departureAirport, arrivalAirport;
//   do {
//     departureAirport = faker.helpers.arrayElement(airports);
//     arrivalAirport = faker.helpers.arrayElement(airports);
//   } while (departureAirport.iata === arrivalAirport.iata);

//   const suggestions = [
//     'Consider offering an upgrade to business class',
//     'Passenger has dietary restrictions noted',
//     'Previous flight was delayed, consider priority boarding',
//     'Frequent flyer, eligible for lounge access',
//     'Group booking, suggest seat assignments together',
//   ];

//   return {
//     id: faker.string.uuid(),
//     flightNumber: faker.airline.flightNumber(),
//     departure: departureAirport,
//     arrival: arrivalAirport,
//     departureDate: departureDate.toISOString(),
//     arrivalDate: arrivalDate.toISOString(),
//     status: faker.helpers.arrayElement(['confirmed', 'pending', 'cancelled']),
//     customers,
//     aiSuggestions: faker.helpers.arrayElements(suggestions, { min: 1, max: 3 }),
//   };
// }

// // Generate users
// async function generateUsers(): Promise<User[]> {
//   const users: User[] = [];

//   // Create admin user
//   users.push({
//     id: faker.string.uuid(),
//     email: 'admin@lumflights.com',
//     password: await bcrypt.hash('admin123', 10),
//     name: 'Admin User',
//     role: 'admin',
//   });

//   // Create staff users
//   for (let i = 0; i < 9; i++) {
//     users.push({
//       id: faker.string.uuid(),
//       email: `staff${i}@lumflights.com`,
//       password: await bcrypt.hash('staff123', 10),
//       name: faker.person.fullName(),
//       role: 'staff',
//     });
//   }

//   return users;
// }

// async function generateMockData() {
//   try {
//     console.log('Generating mock data...');

//     // Generate and store users
//     const users = await generateUsers();
//     const usersBatch = db.batch();
//     users.forEach((user) => {
//       const userRef = db.collection('users').doc(user.id);
//       usersBatch.set(userRef, user);
//     });
//     await usersBatch.commit();
//     console.log('Users created:', users.length);

//     // Generate and store reservations in batches
//     const BATCH_SIZE = 100;
//     const TOTAL_RESERVATIONS = 1000;

//     for (let i = 0; i < TOTAL_RESERVATIONS; i += BATCH_SIZE) {
//       const batch = db.batch();
//       const reservations = Array.from(
//         { length: Math.min(BATCH_SIZE, TOTAL_RESERVATIONS - i) },
//         generateReservation,
//       );

//       reservations.forEach((reservation) => {
//         const reservationRef = db
//           .collection('reservations')
//           .doc(reservation.id);
//         batch.set(reservationRef, reservation);
//       });

//       await batch.commit();
//       console.log(
//         `Processed reservations: ${Math.min(i + BATCH_SIZE, TOTAL_RESERVATIONS)}/${TOTAL_RESERVATIONS}`,
//       );
//     }

//     console.log('Mock data generation completed successfully!');
//     process.exit(0);
//   } catch (error) {
//     console.error('Error generating mock data:', error);
//     process.exit(1);
//   }
// }

// generateMockData();
