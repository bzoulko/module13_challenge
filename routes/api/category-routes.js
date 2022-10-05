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
const { Category, Product } = require('../../models');

// The `/api/categories` endpoint

router.get('/', async (req, res) => {
  // find all categories
  // be sure to include its associated Products

  // 10/05/2022 BZ - Added logic to return all products.
  const data = await Category.findAll();
  return res.json(data);  
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products

  // 10/05/2022 BZ - Added logic to find one category by its id.
  const data = await Catagory.findByPk(req.params.catagory_id);
  return res.json(data);  
});

router.post('/', async (req, res) => {
  // create a new category

  // 10/05/2022 BZ - Made sure the body contained all the necessary parts before
  //                 creating the new entry. Also added async/await to processes.
  await Catagory.create(req.body)
    .then(async (catagory) => {
      // if there's catagories, we need to create pairings to bulk create in the Catagory model
      if (req.body.catagory_name.length) {
        return await Category.create(req.body);
      }
      // if no product tags, just respond
      res.status(200).json(catagory);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
  });


});

router.put('/:id', async (req, res) => {
  // update a category by its `id` value

  // 10/05/2022 BZ - Made sure the body contained all the necessary parts before
  //                 creating the new entry. Also added async/await to processes.
  // update catagory by its id.
  await Catagory.update(req.body, {
    where: {
      catagory_id: req.params.catagory_id,
    },
  })
    .then(async (catagory) => {
      // find all associated catagories from catagory id.
      return await Catagory.findAll({ where: { catagory_id: req.params.catagory_id } });
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

router.delete('/:id', (req, res) => {
  // delete a category by its `id` value
});

module.exports = router;
