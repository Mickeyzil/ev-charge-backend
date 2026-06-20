const mysql = require('mysql2');

// פונקציה לקבלת כל תחנות הטעינה מהדטבייס והתאמתן ל-JSON מחלק א'
const getAllStations = (req, res) => {
    const db = req.app.get('db');

    // שאילתת שליפה של כל התחנות מהטבלה האמיתית שלך
    const query = 'SELECT * FROM Stations';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error while fetching stations:', err);
            return res.status(500).json({ message: 'Server error, failed to fetch stations.' });
        }

        // 🔥 מיפוי והתאמת הנתונים (Mapping) מפורמט ה-SQL לפורמט ה-JSON של ה-Frontend
        const formattedStations = results.map(station => {
            return {
                station_id: station.station_id,
                name: station.name,                                     // מתאים לעמודה name
                statusColor: station.available_slots === 0 ? "#D32F2F" : (station.available_slots === station.total_slots ? "#388E3C" : "#D4AF37"), // חישוב צבע דינמי לפי הזמינות!
                available: `${station.available_slots}/${station.total_slots}`, // מחבר חזרה את 2/3 או 3/6
                power: `${station.power_kw} kW`,                        // מוסיף את ה-kW לערך המספרי
                price: `₪${station.price_kwh}/kWh`,                     // מוסיף את ה-₪ והפורמט למחיר
                // הפיכת הסטרינג המופרד בפסיקים חזרה למערך (Array) כמו שה-Frontend מצפה
                connectors: station.connectors ? station.connectors.split(', ') : [],
                amenities: station.amenities ? station.amenities.split(', ') : []
            };
        });

        // החזרת המערך המעובד והמוכן ל-Frontend בסטטוס 200 OK
        return res.status(200).json(formattedStations);
    });
};

module.exports = {
    getAllStations
};