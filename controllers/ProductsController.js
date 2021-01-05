const Product = require('../models/product');
const _ = require('underscore');

const productValidation = function(product) {
    let message = "";

    if (product.price == undefined || product.price <= 0)
        message += "- Price must be greater than 0\n";

    if (product.weight == undefined || product.weight <= 0)
        message += "- Weight must be greater than 0\n";

    if (product.name == undefined || product.name == '')
        message += "- Product name mustn't be empty\n";

    if (product.description == undefined || product.description == '')
        message += "- Product description mustn't be empty\n";

    if (message == "") {
        return {
            error: false
        };
    } else {
        return {
            error: true,
            data: {
                'message': message
            }
        };
    }
}

exports.getAll = (req, res) => {
    Product.getAll().then(function(allProducts) {
        res.json({
            error: false,
            data: {allProducts}
        });
    });
};

exports.getById = (req, res) => {
    Product.getById(req.params.id).then(function(product) {
        res.json({
            error: false,
            data: {product}
        });
    });
};

exports.store = (req, res) => {
    
    // Handle errors

    const validationResult = productValidation(req.body.product);
    if (validationResult.error) {
        res.status(400).json(validationResult);
        return;
    }

    // No errors. Proceed to add a new product.

    const newProduct = {
        'name': req.body.product.name,
        'description': req.body.product.description,
        'price': req.body.product.price,
        'weight': req.body.product.weight,
        'categoryId': req.body.product.categoryId
    };

    Product.create(newProduct).then(function() {
        res.json({
            error: false,
            data: {
                'product': newProduct
            }
        });
    });
};

exports.updateById = (req, res) => {

    // Handle errors

    const validationResult = productValidation(req.body.product);
    if (validationResult['error']) {
        res.status(500).json(validationResult);
        return;
    }

    // No validation errors. Try to update.

    Product.update(req.body.product)
        .then(function(product){
            res.json({
                error: false,
                data: {product}
            });
        })
        .catch(function(err) {
            res.status(400).json({
                error: true,
                data: {
                    message: "Product with given id doesn't exist"
                }
            });
        });
};

