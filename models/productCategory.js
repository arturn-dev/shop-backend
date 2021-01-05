const bookshelf = require('../config/bookshelf');

const Category = bookshelf.Model.extend({
    tableName: 'ProductCategories'
});

module.exports.getAll = () => {
    return Category.fetchAll();
};