# ev-charge-backend
⚡ EV Charge Backend API

Authors

* Gil Cohen
* Mickey Zilberman

Software Engineering Department
Shenkar College of Engineering, Design and Art
Academic Year: 2025–2026

⸻

Overview

The EV Charge Backend is a RESTful API server developed to support the EV Charge platform.

The server is responsible for:

* User authentication
* Charging station management
* Favorites management
* Reservation management
* System statistics
* External charging company integration

⸻

Technologies

* Node.js
* Express.js
* MySQL
* MySQL2
* CORS
* dotenv

⸻

API Endpoints

Authentication

* POST /api/users/register
* POST /api/users/login

Stations

* GET /api/stations
* PUT /api/stations/external-update/:station_id

Favorites

* POST /api/favorites
* GET /api/favorites/:user_id
* DELETE /api/favorites/:user_id/:station_id

Reservations

* POST /api/reservations
* GET /api/reservations/user/:user_id

Statistics

* GET /api/statistics

⸻

Deployment

* Backend: Render
* Database: MySQL Cloud Database

⸻

Testing

The backend APIs were tested using Postman and integration testing.

⸻

© Gil Cohen & Mickey Zilberman | Shenkar College | 2026
