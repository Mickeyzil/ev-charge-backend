const mysql = require('mysql2');

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

const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide both email and password.' });
    }

    const db = req.app.get('db');

    const loginQuery = 'SELECT * FROM users WHERE email = ?';

    db.query(loginQuery, [email], (err, results) => {
        if (err) {
            console.error('Database error during login:', err);
            return res.status(500).json({ message: 'Server error, please try again.' });
        }

        if (results.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

        const user = results[0];

        if (user.password !== password) {
            return res.status(401).json({ message: 'Invalid email or password.' });
        }

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

const getUserProfile = (req, res) => {
    const { userId } = req.params;
    const db = req.app.get('db');
    const query = 'SELECT user_id, full_name, email, phone, car_model FROM users WHERE user_id = ?';

    db.query(query, [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(results[0]);
    });
};

const updateUserProfile = (req, res) => {
    const { userId } = req.params;
    const { full_name, phone, car_model, password, oldPassword } = req.body;
    const db = req.app.get('db');

    const selectQuery = 'SELECT password FROM users WHERE user_id = ?';
    db.query(selectQuery, [userId], (err, results) => {
        if (err || results.length === 0) return res.status(404).json({ message: 'User not found' });

        const currentPassword = results[0].password;

        if (password && password.trim() !== "") {
            if (oldPassword !== currentPassword) {
                return res.status(400).json({ message: 'The current password you entered is incorrect.' });
            }
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


module.exports = { 
    registerUser, 
    loginUser, 
    getUserProfile,   
    updateUserProfile 
};