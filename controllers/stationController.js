const mysql = require('mysql2');

const getAllStations = (req, res) => {
    
    const db = req.app.get('db');

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
const updateStationByExternalCompany = (req, res) => {
    const { station_id } = req.params;

    const {
        available_slots,
        total_slots,
        power_kw,
        price_kwh,
        connectors,
        amenities,
        latitude,
        longitude
    } = req.body;

    if (!station_id) {
        return res.status(400).json({ message: "Station ID is required." });
    }

    const db = req.app.get("db");

    const query = `
        UPDATE stations
        SET 
            available_slots = ?,
            total_slots = ?,
            power_kw = ?,
            price_kwh = ?,
            connectors = ?,
            amenities = ?,
            latitude = ?,
            longitude = ?
        WHERE station_id = ?
    `;

    db.query(
        query,
        [
            available_slots,
            total_slots,
            power_kw,
            price_kwh,
            connectors,
            amenities,
            latitude,
            longitude,
            station_id
        ],
        (err, result) => {
            if (err) {
                console.error("External station update error:", err);
                return res.status(500).json({ message: "Failed to update station." });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({ message: "Station not found." });
            }

            return res.status(200).json({
                message: "Station updated successfully by external company.",
                station_id: station_id
            });
        }
    );
};

const createStation = (req, res) => {
    const { 
        name, 
        available_slots, 
        total_slots, 
        power_kw, 
        price_kwh, 
        connectors, 
        amenities, 
        latitude, 
        longitude 
    } = req.body;

    const db = req.app.get('db');

    if (!name || available_slots === undefined || total_slots === undefined || !power_kw || !price_kwh) {
        return res.status(400).json({ message: "Missing required fields to create a station." });
    }

    const query = `
        INSERT INTO stations (
            name, 
            available_slots, 
            total_slots, 
            power_kw, 
            price_kwh, 
            connectors, 
            amenities, 
            latitude, 
            longitude
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [
            name, 
            available_slots, 
            total_slots, 
            power_kw, 
            price_kwh, 
            connectors, 
            amenities, 
            latitude, 
            longitude
        ],
        (err, result) => {
            if (err) {
                console.error("Database error during station creation:", err);
                return res.status(500).json({ message: "Failed to create station." });
            }

            return res.status(201).json({
                message: "Station created successfully! ⚡",
                station_id: result.insertId
            });
        }
    );
};

const deleteStation = (req, res) => {
    const { station_id } = req.params;
    const db = req.app.get('db');

    const query = 'DELETE FROM stations WHERE station_id = ?';

    db.query(query, [station_id], (err, result) => {
        if (err) {
            console.error("Database error during station deletion:", err);
            return res.status(500).json({ message: "Failed to delete station." });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: "Station not found." });
        }

        return res.status(200).json({ message: "Station deleted successfully." });
    });
};

module.exports = {
    getAllStations,
    updateStationByExternalCompany,
    createStation, 
    deleteStation
};