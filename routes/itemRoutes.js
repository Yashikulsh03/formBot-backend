// routes/itemRoutes.js
const express = require('express');
const router = express.Router();
const { createItem, getItems } = require('../controllers/Item');

// Route to create items
// router.post('/createform', createItem);

// Route to get items
// router.get('/getitem', getItems);

module.exports = router;
