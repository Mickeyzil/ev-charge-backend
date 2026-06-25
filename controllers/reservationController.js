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

    const query = `
        INSERT INTO reservations
        (user_id, station_id, full_name, email, phone, arrival_date, arrival_time, car_model, connector_type)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
        query,
        [user_id, station_id, full_name, email, phone, arrival_date, arrival_time, car_model, connector_type],
        (err, result) => {
            if (err) {
                console.error("Reservation insert error:", err);
                return res.status(500).json({ message: "Failed to create reservation." });
            }

            res.status(201).json({
                message: "Reservation created successfully!",
                reservationId: result.insertId
            });
        }
    );
};
const getUserReservations = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get("db");

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
};

module.exports = {
    createReservation,
    getUserReservations
};