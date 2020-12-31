const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/IndexController');
const ProductsController = require('../controllers/ProductsController')

router.get('/products', ProductsController.getAll);
router.get('/products/:id', ProductsController.getById);
router.post('/products', ProductsController.store);
router.put('/products/:id', ProductsController.updateById);

module.exports = router;