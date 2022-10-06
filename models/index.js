//
// 10/05/2022 BZ - Added each models correlation to one another and I made sure
//                 to add the CASCADE on delete option to each table definition.

// import models
const Product = require('./Product');
const Category = require('./Category');
const Tag = require('./Tag');
const ProductTag = require('./ProductTag');


// Products belongsTo Category
// 10/05/2022 BZ - Added product correlation.
Product.belongsTo(Category, {
  foreignKey: 'category_id',
  onDelete: 'CASCADE'
});

// Categories have many Products
// 10/05/2022 BZ - Added category correlation.
Category.hasMany(Product, {
  foreignKey: 'id',
  onDelete: 'CASCADE'
});

// Products belongToMany Tags (through ProductTag)
// 10/05/2022 BZ - Added product_tag correlation.
Product.belongsToMany(Tag, {
  through: 'product_tag',
  foreignKey: 'product_id',
  onDelete: 'CASCADE'
});

// Tags belongToMany Products (through ProductTag)
// 10/05/2022 BZ - Added tag correlation.
Tag.belongsToMany(Product, {
  through: 'product_tag',
  foreignKey: 'tag_id',
  onDelete: 'CASCADE'
});

module.exports = {
  Product,
  Category,
  Tag,
  ProductTag
};
