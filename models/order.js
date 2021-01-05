const bookshelf = require('../config/bookshelf');

const OrderedProduct = bookshelf.Model.extend({
    tableName: 'OrderedProducts'
});

const Order = bookshelf.Model.extend({
    tableName: 'Orders',
    products: function() {
        return this.hasMany(OrderedProduct, 'orderId', 'id');
    }
});

module.exports.getAll = () => {
    return Order.fetchAll({
        withRelated: ['products'],
    });
};

module.exports.getById = (id) => {
    return new Order({
        'id': id
    }).fetch({
        withRelated: ['products']
    });
};

module.exports.getByUsername = (username) => {
    return new Order({
        'username': username
    }).fetchAll({
        withRelated: ['products']
    });
};

module.exports.getAllByStatus = (statusId) => {
    return new Order({
        orderStatusId: statusId
    }).fetch({
        withRelated: ['products']
    });
};

module.exports.create = (order) => {
    return new Order({
        approvalDate: null,
        orderStatusId: order.orderStatusId,
        username: order.username,
        email: order.email,
        telNumber: order.telNumber
    }).save();
};

module.exports.addProductToOrder = (orderId, productId, amount) => {
    return new OrderedProduct({
        'orderId': orderId,
        'productId': productId,
        'amount': amount
    }).save();
}

module.exports.updateStatus = (id, statusId) => {
    let updateObj = {
        orderStatusId: statusId
    };

    // If status changes to 'APPROVAL'
    if (statusId == 2) {
        updateObj.approvalDate = new Date();
    }
    
    return new Order({
        'id': id
    }).save(updateObj, {patch: true});
};