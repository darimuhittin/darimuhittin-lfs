# LumFlights Server

A robust and secure backend for the LumFlights flight reservation management system, built with NestJS and Firebase.

## Features

- 🔐 **Authentication & Authorization**

  - JWT-based authentication
  - Role-based access control (Admin/Staff)
  - Token refresh mechanism
  - Secure password hashing with bcrypt

- 🛡️ **Security**

  - Helmet security middleware
  - CORS protection
  - Rate limiting (10 requests/minute)
  - Request validation
  - Type-safe endpoints

- 📝 **API Documentation**

  - Swagger/OpenAPI documentation
  - API versioning
  - Detailed endpoint descriptions
  - Request/response schemas

- ✈️ **Reservation Management**

  - CRUD operations for flight reservations
  - Advanced filtering and pagination
  - Real-time updates
  - AI-powered suggestions
  - Customer management

- 📊 **Data Management**

  - Firestore database integration
  - Efficient querying
  - Data validation
  - Mock data generation

- 🔍 **Monitoring**
  - Request logging
  - Error tracking
  - Performance monitoring
  - API metrics

## Tech Stack

- **Framework**: NestJS
- **Language**: TypeScript
- **Database**: Firebase Firestore
- **Authentication**: Passport.js, JWT
- **Documentation**: Swagger/OpenAPI
- **Security**: Helmet
- **Validation**: class-validator
- **Testing**: Jest

## Getting Started

1. Clone the repository

2. Install dependencies:

   ```bash
   pnpm install
   ```

3. Set up environment variables: i will give this with email

4. Run the development server:

   ```bash
   pnpm dev
   ```

5. Access the API documentation at [http://localhost:4000/api](http://localhost:4000/api)

## Project Structure

```
src/
├── auth/              # Authentication module
├── reservations/      # Reservations module
├── firestore/         # Database module
├── middleware/        # Custom middleware
├── scripts/          # Utility scripts
└── types/            # TypeScript types
```

## API Endpoints

### Authentication

- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user
- `POST /auth/refresh` - Refresh access token
- `POST /auth/logout` - Logout user
- `GET /auth/me` - Get current user

### Reservations

- `GET /reservations` - Get all reservations (with filters)
- `GET /reservations/:id` - Get reservation by ID
- `POST /reservations` - Create new reservation
- `PUT /reservations/:id` - Update reservation
- `DELETE /reservations/:id` - Delete reservation
- `GET /reservations/:id/suggestions` - Get AI suggestions

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build production bundle
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm lint` - Run ESLint
- `pnpm format` - Format code with Prettier
- `pnpm generate-mock-data` - Generate mock data

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

This project is licensed under the MIT License.
