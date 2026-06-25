const getStatistics = (req, res) => {
    const db = req.app.get("db");

    const query = `
        SELECT
            (SELECT COUNT(*) FROM users) AS total_users,
            (SELECT COUNT(*) FROM stations) AS total_stations,
            (SELECT COUNT(*) FROM reservations) AS total_reservations,
            (SELECT COUNT(*) FROM favorites) AS total_favorites,
            (SELECT COUNT(*) FROM stations WHERE available_slots > 0) AS available_stations,
            (SELECT COUNT(*) FROM stations WHERE available_slots = 0) AS fully_booked_stations
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error("Statistics error:", err);
            return res.status(500).json({
                message: "Failed to fetch statistics."
            });
        }

        res.status(200).json(results[0]);
    });
};

module.exports = {
    getStatistics
};