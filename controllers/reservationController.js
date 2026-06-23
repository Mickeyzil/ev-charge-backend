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

module.exports = {
    createReservation
};