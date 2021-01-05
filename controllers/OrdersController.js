const Order = require('../models/order');
const OrderStatus = require('../models/orderStatus');
const Product = require('../models/product');
const _ = require('underscore');

const newOrderValidation = function(order) {
    let message = "";

    if (order.username == undefined || order.username == '')
        message += "- Username mustn't be empty\n"

    if (order.email == undefined || order.email == '')
        message += "- Email mustn't be empty\n";

    if (order.telNumber == undefined || order.telNumber == '')
        message += "- Telephone number mustn't be empty\n";

    if (order.username.match("^[a-zA-Z0-9_]{3,50}$") == undefined)
        message += "- Username can only contain letters, numbers and '_' character\n";

    if (order.email.match("^[a-zA-Z0-9_]+@[a-z]+.[a-z]+$") == undefined)
        message += "- Email must be in form of 'user@example.com'\n";

    if (order.telNumber.match("^[0-9]{9}$") == undefined)
        message += "- Telephone number should contain only 9 digits\n";

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

let orderedProductsValidation = function(products) {
    let message = "";

    if (products == undefined || products == {}) {
        message = "- Products list can't be empty.";
    } else {
        products.forEach(product => {
            if (product.amount == undefined || product.amount <= 0)
                message += `- Amount of product with id: ${product.id}, `
                    + `is: ${product.amount}, but should be greater than 0`;
        });
    }

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

let orderStatusUpdateValidation = function(order, newStatusId) {
    let message = "";

    switch(order.orderStatusId) {
        case 1: { // NOT APPROVED
            // All updates allowed.
        } break;
        case 2: { // APPROVED
            if (newStatusId == 1) {
                message = "Status update from status: 'APPROVED' to status: 'NOT APPROVED' is not allowed.";
            }
        } break;
        case 3: { // CANCELLED
            message = "Status update from status: 'CANCELLED' is not allowed.";
        } break;
        case 4: { // COMPLETED
            message = "Status update from status: 'COMPLETED' is not allowed.";
        } break;
    }

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

exports.getAllStatuses = (req, res) => {
    OrderStatus.getAll().then(function(orderStatuses) {
        res.json({
            error: false,
            data: {
                'orderStatuses': orderStatuses
            }
        });
    });
};

exports.getAll = (req, res) => {
    Order.getAll().then(function(allOrders) {
        res.json({
            error: false,
            data: {
                orders: allOrders
            }
        });
    });
};

exports.getById = (req, res) => {
    Order.getById(req.params.id).then(function(order) {
        res.json({
            error: false,
            data: {
                'order': order
            }
        });
    });
};

exports.getByUsername = (req, res) => {
    Order.getByUsername(req.params.username).then(function(orders) {
        res.json({
            error: false,
            data: {
                'orders': orders
            }
        });
    });
};

exports.getAllByStatus = (req, res) => {
    Order.getAllByStatus(req.params.statusId)
        .then(function(orders) {
            res.json({
                error: false,
                data: {
                    'orders': orders
                }
            });
        })
        .catch(function(err) {
            res.json({
                error: false,
                data: {
                    'orders': []
                }
            });
        });
};

exports.store = (req, res) => {

    let validationResult = newOrderValidation(req.body.order);
    if (validationResult.error) {
        res.status(400).json(validationResult);
        return;
    }

    validationResult = orderedProductsValidation(req.body.order.products);
    if (validationResult.error) {
        res.status(400).json(validationResult);
        return;
    }

    const orderedProductIds = _.pluck(req.body.order.products, 'id');
    const newOrder = {
        'orderStatusId': 1,
        'username': req.body.order.username,
        'email': req.body.order.email,
        'telNumber': req.body.order.telNumber
    };

    let message = "";
    Product.getAll().then(function(products) {
        // Check if products exist.
        orderedProductIds.forEach(id => {
            if (_.findWhere(products.models, {'id': id}) == undefined) {
                message += `- Product with id: ${id} doesn't exist.\n`
            }
        });

        // Send error if any of the products doesn't exist and return.
        if (message != "") {
            res.status(400).json({
                error: true,
                data: {
                    'message': message
                }
            });
            return;
        }

        Order.create(newOrder).then(function(order) {
            req.body.order.products.forEach(product => {
                Order.addProductToOrder(order.id, product.id, product.amount)
                    .catch(function(err) {
                        res.status(500).json({
                            error: true,
                            data: {
                                message: `Failed to add product with id: ${product.id} to the new order.`
                            }
                        });
                        return;
                    });
            });
        });

        res.json({
            error: false,
            data: {
                message: 'Order successfully created!'
            }
        });
    });
};

exports.updateStatusById = (req, res) => {
    Order.getById(req.params.id).then(function(order) {
        let validationResult = orderStatusUpdateValidation(order.toJSON(), req.params.newStatusId);
        if (validationResult.error) {
            res.status(400).json(validationResult);
            return;
        }

        Order.updateStatus(req.params.id, req.params.newStatusId).then(function(order) {
            res.json({
                error: false,
                data: {order}
            });
            return;
        });
    })
    .catch(function(err) {
        res.status(400).json({
            error: true,
            data: {
                message: `Order with id: ${req.params.id} doesn't exist`
            }
        });
    });
};