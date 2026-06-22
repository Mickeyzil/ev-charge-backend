const mysql = require('mysql2');

// פונקציה לקבלת כל תחנות הטעינה מהדטבייס והתאמתן ל-JSON מחלק א'
const getAllStations = (req, res) => {
    const db = req.app.get('db');

    // שאילתת שליפה של כל התחנות מהטבלה האמיתית שלך
    const query = 'SELECT * FROM stations';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Database error while fetching stations:', err);
            return res.status(500).json({ message: 'Server error, failed to fetch stations.' });
        }

        const formattedStations = results.map(station => {
            return {
                station_id: station.station_id,
                name: station.name,                                     
                statusColor: station.available_slots === 0 ? "#D32F2F" : (station.available_slots === station.total_slots ? "#388E3C" : "#D4AF37"), 
                available: `${station.available_slots}/${station.total_slots}`, 
                power: `${station.power_kw} kW`,                        
                price: `₪${station.price_kwh}/kWh`,                     
                connectors: station.connectors ? station.connectors.split(', ') : [],
                amenities: station.amenities ? station.amenities.split(', ') : [],

                latitude: station.latitude,
                longitude: station.longitude
            };
        });

        return res.status(200).json(formattedStations);
    });
};

module.exports = {
    getAllStations
};