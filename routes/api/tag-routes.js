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
const { Tag, Product, ProductTag } = require('../../models');

// The `/api/tags` endpoint

router.get('/', async (req, res) => {
  // find all tags
  // be sure to include its associated Product data

  // 10/05/2022 BZ - Added logic to return all tags.
  const data = await Tag.findAll();
  return res.json(data);  
});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  // 10/05/2022 BZ - Added logic to find one tag by its id.
  const data = await Tag.findByPk(req.params.tag_id);
  return res.json(data);  
});

router.post('/', async (req, res) => {
  // create a new tag
  
  // 10/05/2022 BZ - Made sure the body contained all the necessary parts before
  //                 creating the new entry. Also added async/await to processes.
  if (!req.body.product_id) req.body.product_id = 4;
  if (!req.body.tag_id)     req.body.tag_id = 2;

  await Tag.create(req.body)
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

router.put('/:id', async (req, res) => {
  // update a tag's name by its `id` value

  // 10/05/2022 BZ - Made sure the body contained all the necessary parts before
  //                 creating the new entry. Also added async/await to processes.
  await Tag.update(req.body, {
    where: {
      tag_id: req.params.tag_id,
    },
  })
    .then(async (tag) => {
      // find all associated tags from ProductTag
      return await ProductTag.findAll({ where: { tag_id: req.params.tag_id } });
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
  // delete on tag by its `id` value

  // 10/05/2022 BZ - Add logic to remove one product at a time by tag_id.
  const data = await Tag.destroy({
    where: {
        tag_id: req.params.tag_id 
    }
  })
  if(data > 0) {
      return res.json({ status: `Deleted tag(s) with id = ${req.params.tag_id}`});
  } else {
      return res.json({ status: `ERROR: Unable to delete tag(s) with id = ${req.params.tag_id}`});
  }

});

module.exports = router;
