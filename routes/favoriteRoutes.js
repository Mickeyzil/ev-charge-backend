const express = require('express');
const router = express.Router();
const { addFavorite, removeFavorite, getFavorites } = require('../controllers/favoriteController');

router.post('/add', addFavorite);
router.delete('/remove', removeFavorite);
router.get('/:userId', getFavorites);

module.exports = router;