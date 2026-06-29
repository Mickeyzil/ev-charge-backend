const createReservation = (req, res) => {
    const {
        user_id,
        station_id,
        full_name,
        email,
        phone,
        arrival_date,
        arrival_time,
        car_model,
        connector_type
    } = req.body;

    if (
        !user_id ||
        !station_id ||
        !full_name ||
        !email ||
        !phone ||
        !arrival_date ||
        !arrival_time ||
        !car_model ||
        !connector_type
    ) {
        return res.status(400).json({ message: "All fields are required." });
    }

    const db = req.app.get("db");

    const checkExistQuery = `
        SELECT 
            (SELECT COUNT(*) FROM users WHERE user_id = ?) AS user_exists,
            (SELECT COUNT(*) FROM stations WHERE station_id = ?) AS station_exists,
            (SELECT available_slots FROM stations WHERE station_id = ?) AS available_slots
    `;

    db.query(checkExistQuery, [user_id, station_id, station_id], (err, existResults) => {
        if (err) {
            console.error("Database error during verification:", err);
            return res.status(500).json({ message: "Database error during verification." });
        }

        const { user_exists, station_exists, available_slots } = existResults[0];

        if (user_exists === 0) {
            return res.status(404).json({ message: "Failed to create reservation. User does not exist." });
        }

        if (station_exists === 0) {
            return res.status(404).json({ message: "Failed to create reservation. Charging station does not exist." });
        }

        if (available_slots !== null && available_slots <= 0) {
            return res.status(400).json({ message: "Reservation blocked. Station is full!" });
        }

        const insertQuery = `
            INSERT INTO reservations
            (user_id, station_id, full_name, email, phone, arrival_date, arrival_time, car_model, connector_type)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;

        db.query(
            insertQuery,
            [user_id, station_id, full_name, email, phone, arrival_date, arrival_time, car_model, connector_type],
            (err, result) => {
                if (err) {
                    console.error("Reservation insert error:", err);
                    return res.status(500).json({ message: "Failed to create reservation." });
                }

                const updateStationQuery = `
                    UPDATE stations 
                    SET available_slots = available_slots - 1 
                    WHERE station_id = ? AND available_slots > 0
                `;

                db.query(updateStationQuery, [station_id], (updateErr) => {
                    if (updateErr) {
                        console.error("Error updating station available slots:", updateErr);
                    }

                    res.status(201).json({
                        message: "Reservation created successfully! 📅",
                        reservationId: result.insertId
                    });
                });
            }
        );
    });
};

const getUserReservations = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get("db");

    const checkUserQuery = 'SELECT user_id FROM users WHERE user_id = ?';

    db.query(checkUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error("Error checking user existence:", err);
            return res.status(500).json({ message: "Database error." });
        }

        if (userResults.length === 0) {
            return res.status(404).json({ message: "User not found." });
        }

        const query = `
            SELECT
                r.reservation_id,
                r.station_id,
                s.name AS station_name,
                r.arrival_date,
                r.arrival_time,
                r.car_model,
                r.connector_type
            FROM reservations r
            JOIN stations s
                ON r.station_id = s.station_id
            WHERE r.user_id = ?
            ORDER BY r.arrival_date DESC, r.arrival_time DESC
        `;

        db.query(query, [userId], (err, results) => {
            if (err) {
                console.error("Error fetching reservations:", err);
                return res.status(500).json({
                    message: "Failed to fetch reservations."
                });
            }

            return res.status(200).json(results);
        });
    });
};

module.exports = {
    createReservation,
    getUserReservations
};