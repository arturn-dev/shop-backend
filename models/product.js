const bookshelf = require('../config/bookshelf');

const Product = bookshelf.Model.extend({
    tableName: 'Products'
});

module.exports.getAll = () => {
    return Product.fetchAll();
};

module.exports.getById = (id) => {
    return new Product({
        'id': id
    }).fetch();
};

module.exports.create = (product) => {
    return new Product({
        name: product.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
        categoryID: product.categoryID
    }).save();
};

module.exports.update = (product) => {
    return new Product({
        id: product.id
    }).save({
        name: product.name,
        description: product.description,
        price: product.price,
        weight: product.weight,
        categoryID: product.categoryID
    },
    {
        patch: true
    }
    );
};

