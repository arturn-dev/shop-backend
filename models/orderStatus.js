const bookshelf = require('../config/bookshelf');

const OrderStatus = bookshelf.Model.extend({
    tableName: 'OrderStatuses'
});

module.exports.getAll = () => {
    return OrderStatus.fetchAll();
};