# SeatVerse – Movie Seat Booking System

SeatVerse is a simplified movie ticket booking system inspired by platforms like BookMyShow. It allows users to authenticate, view available seats, and book them in real time.

## Features
User authentication (login and registration)
Real-time seat booking
Clear visualization of available and booked seats
Displays the user who booked each seat
Concurrency-safe booking using PostgreSQL transactions
Protected routes using JWT authentication
Tech Stack

## Frontend

HTML
Tailwind CSS
JavaScript

## Backend

Node.js
Express.js

## Database

PostgreSQL

## How It Works
- The user registers or logs in
- Seats are fetched from the database
- Available seats are displayed
- When a user selects a seat:
- Authentication is verified
- The seat is booked if available
- Booked seats display the user who reserved them

## Key Concepts
- Database transactions (BEGIN, COMMIT, ROLLBACK)
- Row-level locking (FOR UPDATE) to prevent double booking
- JWT-based authentication
- REST API design

## Setup Instructions
### 1. Clone the repository
```
git clone https://github.com/your-username/seatverse-booking-system.git
cd seatverse-booking-system
```
### 2. Install dependencies
```
npm install
```
### 3. Configure environment variables

Create a .env file:
```
DATABASE_URL=your_postgres_connection_string
PORT= 8080
JWT_ACCESS_SECRET=your_secret
JWT_REFRESH_SECRET=your_secret
JWT_ACCESS_EXPIRES_IN=m
JWT_REFRESH_EXPIRES_IN=d
```

### 4. Setup database

Run the following SQL:
```
CREATE TABLE seats (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255),
  isbooked INT DEFAULT 0
);

INSERT INTO seats (isbooked)
SELECT 0 FROM generate_series(1, 20);
```
### 5. Start the server
```
npm start
```
### 6. Open in browser
```
http://localhost:8080
```