const express = require('express');
const router = express.Router();
const IndexController = require('../controllers/IndexController');
const ProductsController = require('../controllers/ProductsController');
const ProductCategoriesController = require('../controllers/ProductCategoriesController');
const OrdersController = require('../controllers/OrdersController');

router.get('/products', ProductsController.getAll);
router.post('/products', ProductsController.store);
router.put('/products', ProductsController.updateById);
router.get('/products/:id', ProductsController.getById);
router.get('/categories', ProductCategoriesController.getAll);
router.get('/orders', OrdersController.getAll);
router.post('/orders', OrdersController.store);
router.get('/orders/:id/:newStatusId', OrdersController.updateStatusById);
router.get('/orders/:statusId', OrdersController.getAllByStatus);
router.get('/status', OrdersController.getAllStatuses);

module.exports = router;