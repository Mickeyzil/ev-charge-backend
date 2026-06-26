// 1. הוספת תחנה למועדפים (כולל הגנה מפני ID לא קיים)
const addFavorite = (req, res) => {
    const { user_id, station_id } = req.body;
    const db = req.app.get('db');

    // בדיקת חובה בסיסית לשדות הבקשה
    if (!user_id || !station_id) {
        return res.status(400).json({ message: 'User ID and Station ID are required' });
    }

    const query = 'INSERT INTO favorites (user_id, station_id) VALUES (?, ?)';
    db.query(query, [user_id, station_id], (err, result) => {
        if (err) {
            // מניעת כפילויות במידה והתחנה כבר קיימת במועדפים של המשתמש
            if (err.code === 'ER_DUP_ENTRY') {
                return res.status(400).json({ message: 'Station already in favorites' });
            }
            
            // הגנה: אם ה-user_id או ה-station_id לא קיימים בכלל בטבלאות האם שלהם בדטבייס
            if (err.code === 'ER_NO_REFERENCED_ROW_2' || err.code === 'ER_NO_REFERENCED_ROW') {
                return res.status(404).json({ message: 'Failed to add favorite. User or Station does not exist.' });
            }

            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(201).json({ message: 'Station added to favorites! ❤️' });
    });
};

// 2. הסרת תחנה מהמועדפים (כולל הגנה מפני מחיקת קשר לא קיים)
const removeFavorite = (req, res) => {
    const { user_id, station_id } = req.body;
    const db = req.app.get('db');

    if (!user_id || !station_id) {
        return res.status(400).json({ message: 'User ID and Station ID are required' });
    }

    const query = 'DELETE FROM favorites WHERE user_id = ? AND station_id = ?';
    db.query(query, [user_id, station_id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({ message: 'Database error' });
        }

        // הגנה: אם result.affectedRows הוא 0, זה אומר ששום שורה לא נמחקה (הקשר לא היה קיים בדטבייס)
        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Favorite relation not found. Check if user or station exists.' });
        }

        res.status(200).json({ message: 'Station removed from favorites successfully.' });
    });
};

// 3. שליפת כל התחנות המועדפות של משתמש מסוים (כולל בדיקת קיום משתמש)
const getFavorites = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');

    // שלב א': בדיקה האם המשתמש בכלל קיים במערכת (לפי ה-user_id של טבלת users)
    const checkUserQuery = 'SELECT user_id FROM users WHERE user_id = ?';

    db.query(checkUserQuery, [userId], (err, userResults) => {
        if (err) {
            console.error("Database error checking user:", err);
            return res.status(500).json({ message: 'Database error' });
        }

        // אם המערך ריק - המשתמש לא קיים בדטבייס! נחזיר שגיאת 404 מסודרת
        if (userResults.length === 0) {
            return res.status(404).json({ message: 'User not found.' });
        }

        // שלב ב': המשתמש קיים! עכשיו נשלוף בבטחה את המועדפים שלו בעזרת ה-JOIN
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
            // יחזיר מערך ריק [] אם המשתמש קיים ואין לו מועדפים, או מערך מלא אם יש לו מועדפים
            res.status(200).json(results);
        });
    });
};

module.exports = {
    addFavorite,
    removeFavorite,
    getFavorites
};