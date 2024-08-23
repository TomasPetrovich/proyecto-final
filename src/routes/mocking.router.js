
const express = require('express');
const router = express.Router();
const { generateMockProducts } = require('../controllers/mocking.controller.js');

router.get('/mockingproducts', (req, res) => {
    const products = generateMockProducts();
    res.json(products);
});

module.exports = router;
