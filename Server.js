const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/userRoutes');
const stationRoutes = require('./routes/stationRoutes');
const favoriteRoutes = require('./routes/favoriteRoutes');
const reservationRoutes = require('./routes/reservationRoutes');
const statisticsRoutes = require('./routes/statisticsRoutes');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'ev_charge_db',
    port: process.env.DB_PORT || 19117,
    ssl: {
        rejectUnauthorized: false
    }
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.message);
        return;
    }

    console.log('✅ Connected successfully to MySQL database!');
});

app.set('db', db);

app.use('/api/users', userRoutes);
app.use('/api/stations', stationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reservations', reservationRoutes);
app.use('/api/statistics', statisticsRoutes);

app.get('/', (req, res) => {
    res.send('EV Charge Server is running smoothly! ⚡');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});