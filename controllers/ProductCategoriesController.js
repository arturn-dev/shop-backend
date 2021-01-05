const Category = require('../models/productCategory');

exports.getAll = (req, res) => {
    Category.getAll().then(function(categories){
        res.json(categories);
    });
};