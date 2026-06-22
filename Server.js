const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const dotenv = require('dotenv');

// 1. ייבוא קבצי ה-Routes
const userRoutes = require('./routes/userRoutes');
const stationRoutes = require('./routes/stationRoutes'); // 🔥 שורה חדשה: מייבאים את ניתובי התחנות
const favoriteRoutes = require('./routes/favoriteRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'ev_charge_db'
});

db.connect((err) => {
    if (err) {
        console.error('❌ Error connecting to the database:', err.message);
        return;
    }
    console.log('✅ Connected successfully to MySQL database!');
});

// מאפשר לקבצים אחרים (כמו ה-Controller) לגשת למשתנה ה-db דרך req.app.get('db')
app.set('db', db);

// 2. 🔥 חיבור ה-Routes של המערכת לשרת
app.use('/api/users', userRoutes);
app.use('/api/stations', stationRoutes); // 🔥 שורה חדשה: כל הכתובות שיגיעו ל- /api/stations יופנו לקובץ של התחנות!
app.use('/api/favorites', favoriteRoutes);

app.get('/', (req, res) => {
    res.send('EV Charge Server is running smoothly! ⚡');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});