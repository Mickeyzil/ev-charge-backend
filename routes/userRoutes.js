const express = require('express');
const router = express.Router();
// ייבוא שתי הפונקציות מה-Controller המעודכן
const { registerUser, loginUser } = require('../controllers/userController');

// הגדרת נתיב מסוג POST עבור הרשמה (/api/users/register)
router.post('/register', registerUser);

// 🔥 הגדרת נתיב מסוג POST עבור התחברות (/api/users/login)
router.post('/login', loginUser);

module.exports = router;