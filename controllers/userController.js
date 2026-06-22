// אנחנו מייבאים את החיבור לדטבייס שיצרנו ב-server.js
const mysql = require('mysql2');

// 1. פונקציית ההרשמה (נשארה בדיוק אותו דבר)
const registerUser = (req, res) => {
    const { full_name, email, password, phone, car_model } = req.body;

    if (!full_name || !email || !password || !phone || !car_model) {
        return res.status(400).json({ message: 'All fields are required!' });
    }

    const db = req.app.get('db');
    const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
    
    db.query(checkUserQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error during check:', err);
            return res.status(500).json({ message: 'Server error, please try again.' });
        }

        if (results.length > 0) {
            return res.status(400).json({ message: 'Email is already registered!' });
        }

        const insertUserQuery = `
            INSERT INTO users (full_name, email, password, phone, car_model) 
            VALUES (?, ?, ?, ?, ?)
        `;

        db.query(insertUserQuery, [full_name, email, password, phone, car_model], (err, result) => {
            if (err) {
                console.error('Database error during insertion:', err);
                return res.status(500).json({ message: 'Failed to register user.' });
            }

            return res.status(201).json({ 
                message: 'User registered successfully! 🎉',
                userId: result.insertId 
            });
        });
    });
};

// 2. 🔥 פונקציית ההתחברות החדשה!
const loginUser = (req, res) => {
    const { email, password } = req.body;

    // בדיקה בסיסית שהוזנו איมייל וסיסמה
    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const db = req.app.get('db');

    // שאילתה לבדיקה ושליפת המשתמש לפי האימייל שלו
    const loginQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(loginQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ message: 'Server error, please try again.' });
        }

        // אם מערך התוצאות ריק, זה אומר שלא קיים משתמש עם המייל הזה
        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        // בדיקה האם הסיסמה שהוזנה תואמת למה שיש בדטבייס
        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        // התחברות הצליחה! מחזירים את פרטי המשתמש ללא הסיסמה (מטעמי אבטחה)
        return res.status(200).json({
            message: 'Login successful! 👋',
            user: {
                user_id: user.user_id,
                full_name: user.full_name,
                email: user.email,
                phone: user.phone,
                car_model: user.car_model
            }
        });
    });
};

// פונקציה לשליפת פרטי משתמש (לצורך טעינה למסך העריכה)
const getUserProfile = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');
    const query = 'SELECT user_id, full_name, email, phone, car_model FROM users WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(results[0]);
    });
};

// פונקציה לעדכון פרטי משתמש
// בתוך userController.js
const updateUserProfile = (req, res) => {
    const { userId } = req.params;
    const { full_name, phone, car_model, password, oldPassword } = req.body;
    const db = req.app.get('db');

    const selectQuery = 'SELECT password FROM users WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });

        const currentPassword = results[0].password;

        // אם המשתמש מנסה לשנות סיסמה
        if (password && password.trim() !== "") {
            // 1. בדיקה שהסיסמה הישנה שהוזנה נכונה
            if (oldPassword !== currentPassword) {
                return res.status(400).json({ message: 'The current password you entered is incorrect.' });
            }
            // 2. בדיקה שהסיסמה החדשה שונה מהישנה
            if (password === currentPassword) {
                return res.status(400).json({ message: 'New password cannot be the same as your old password.' });
            }
        }

        let query = 'UPDATE users SET full_name = ?, phone = ?, car_model = ?';
        const params = [full_name, phone, car_model];

        if (password && password.trim() !== "") {
            query += ', password = ?';
            params.push(password);
        }

        query += ' WHERE user_id = ?';
        params.push(userId);

        db.query(query, params, (err, result) => {
            if (err) return res.status(500).json({ message: 'Database error' });
            res.status(200).json({ message: 'Profile updated successfully!' });
        });
    });
};

module.exports = { registerUser, loginUser, getUserProfile, updateUserProfile };

// ייצוא שתי הפונקציות כדי שקובץ ה-Routes יוכל להשתמש בהן
// ... (הפונקציות שלך getUserProfile ו-updateUserProfile כבר שם, אז רק תוודא שהן מיוצאות כך בסוף)

module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile,   // תוודא שזה מופיע כאן
    updateUserProfile // תוודא שזה מופיע כאן
};