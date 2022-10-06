/*
    Created:    10/05/2022 
    Programmer: Brian Zoulko
    Notes:      Devopled JAVASCRIPT module was designed by bootcamp.

    Modification
    ============
    10/05/2022 Brian Zoulko    Added necessary code for GET/PUT/POST/DELETE operations,
                               updated all functions with async/await operations to ensure
                               all calls operate in the order called.
*/

const router = require('express').Router();
const { Product, Category, Tag, ProductTag } = require('../../models');

// The `/api/products` endpoint

// get all products
router.get('/', async(req, res) => {
  // find all products
  // be sure to include its associated Category and Tag data
  
  // 10/05/2022 BZ - Added logic to return all products.
  try {
    const productData = await Product.findAll({
      include: [{ model: Category }, { model: Tag }],
    });
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }

});

// get one product
router.get('/:id', async(req, res) => {
  // find a single product by its `id`
  // be sure to include its associated Category and Tag data
  
  // 10/05/2022 BZ - Added logic to find one product by id.
  try {
    const productData = await Product.findByPk(req.params.id, {
      include: [{ model: Category }, { model: Tag }],
    });
    if (!ProductData) {
      res.status(404).json({ message: 'No product found with that id!' });
      return;
    }
    res.status(200).json(productData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// create new product
router.post('/', async(req, res) => {
  /* req.body should look like this...
    {
      product_name: "Basketball",
      price: 200.00,
      stock: 3,
      tagIds: [1, 2, 3, 4]
    }
  */

  // 10/05/2022 BZ - Made sure the body contained all the necessary parts before
  //                 creating the new entry. Also added async/await to processes.
  if (!req.body.product_name) req.body.product_name = "Baseball";
  if (!req.body.price)        req.body.price = 25.00;
  if (!req.body.stock)        req.body.stock = 3;
  if (!req.body.tagIds)       req.body.tagIds = [1, 2, 3, 4];

  await Product.create(req.body)
    .then(async (product) => {
      // if there's product tags, we need to create pairings to bulk create in the ProductTag model
      if (req.body.tagIds.length) {
        const productTagIdArr = req.body.tagIds.map((tag_id) => {
          return {
            product_id: product.id,
            tag_id,
          };
        });
        return await ProductTag.bulkCreate(productTagIdArr);
      }
      // if no product tags, just respond
      res.status(200).json(product);
    })
    .then((productTagIds) => res.status(200).json(productTagIds))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

// update product
router.put('/:id', async(req, res) => {
  // update product data
  await Product.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
    .then(async (product) => {
      // find all associated tags from ProductTag
      return await ProductTag.findAll({ where: { product_id: req.params.id } });
    })
    .then(async (productTags) => {
      // get list of current tag_ids
      const productTagIds = productTags.map(({ tag_id }) => tag_id);
      // create filtered list of new tag_ids
      const newProductTags = req.body.tagIds
        .filter((tag_id) => !productTagIds.includes(tag_id))
        .map((tag_id) => {
          return {
            product_id: req.params.id,
            tag_id,
          };
        });
      // figure out which ones to remove
      const productTagsToRemove = productTags
        .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
        .map(({ id }) => id);

      // run both actions
      return Promise.all([
        ProductTag.destroy({ where: { id: productTagsToRemove } }),
        ProductTag.bulkCreate(newProductTags),
      ]);
    })
    .then((updatedProductTags) => res.json(updatedProductTags))
    .catch((err) => {
      // console.log(err);
      res.status(400).json(err);
    });
});

router.delete('/:id', async (req, res) => {
  // delete one product by its `id` value

  // 10/05/2022 BZ - Add logic to remove one product at a time by id.
  const data = await Product.destroy({
    where: {
        id: req.params.id 
    }
  })
  if(data === 1) {
      return res.json({ status: `Deleted product id = ${req.params.id}`});
  } else {
      return res.json({ status: `ERROR: Unable to delete product id = ${req.params.id}`});
  }

});

module.exports = router;
