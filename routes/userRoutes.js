const express = require('express');
const router = express.Router();
// ייבוא פעם אחת בלבד של כל הפונקציות מה-Controller
const { registerUser, loginUser, getUserProfile, updateUserProfile } = require('../controllers/userController');

// הגדרת הנתיבים
router.post('/register', registerUser);
router.post('/login', loginUser);

// נתיבי הפרופיל החדשים
router.get('/:userId', getUserProfile); 
router.post('/update/:userId', updateUserProfile);

module.exports = router;