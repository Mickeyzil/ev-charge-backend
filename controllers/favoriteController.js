// 1. הוספת תחנה למועדפים
const addFavorite = (req, res) => {
    const { user_id, station_id } = req.body;
    const db = req.app.get('db');

    if (!user_id || !station_id) {
        return res.status(400).json({ message: 'User ID and Station ID are required' });
    }

    const query = 'INSERT INTO favorites (user_id, station_id) VALUES (?, ?)';
    db.query(query, [user_id, station_id], (err, result) => {
        if (err) {
            // אם המשתמש כבר הוסיף את התחנה בעבר (מניעת כפילויות הודות ל-Primary Key המשותף)
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Station already in favorites' });
            }
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Station added to favorites! ❤️' });
    });
};

// 2. הסרת תחנה מהמועדפים
const removeFavorite = (req, res) => {
    const { user_id, station_id } = req.body;
    const db = req.app.get('db');

    const query = 'DELETE FROM favorites WHERE user_id = ? AND station_id = ?';
    db.query(query, [user_id, station_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json({ message: 'Station removed from favorites' });
    });
};

// 3. שליפת כל התחנות המועדפות של משתמש מסוים (כולל פרטי התחנה בעזרת JOIN)
const getFavorites = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');

    // השאילתה המדויקת לפי מבנה העמודות המעודכן בטבלת stations שלך
    const query = `
        SELECT 
            f.station_id AS favorite_id, 
            s.station_id AS id, 
            s.name AS name, 
            s.available_slots AS available_slots, 
            s.total_slots AS total_slots, 
            s.power_kw AS power, 
            s.price_kwh AS price, 
            s.connectors AS connectors, 
            s.amenities AS amenities
        FROM favorites f
        JOIN stations s ON f.station_id = s.station_id
        WHERE f.user_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error("Database error in getFavorites:", err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);
    });
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};