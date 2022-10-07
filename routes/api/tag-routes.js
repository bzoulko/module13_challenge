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
  try {
    const tagData = await Tag.findAll({
      include: [{ model: Product, through: ProductTag, as: 'tag_id' }]
    });    
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }

});

router.get('/:id', async (req, res) => {
  // find a single tag by its `id`
  // be sure to include its associated Product data

  // 10/05/2022 BZ - Added logic to find one tag by its id.
  try {
    const tagData = await Tag.findByPk(req.params.id, {
      include: [{ model: Product, through: ProductTag, as: 'tag_id' }]
    });
    if (!tagData) {
      res.status(404).json({ message: 'No tag found with that id!' });
      return;
    }
    res.status(200).json(tagData);
  } catch (err) {
    res.status(500).json(err);
  }
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
      if (req.body.tag_Id) {
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
  await Tag.update(req.body, { where: { id: req.params.id } 
  })
  .then(async () => {
    // find all associated catagories from catagory id.
    return await Tag.findAll({ 
      where: { id: req.params.id },
      include: [{ model: Product, through: ProductTag, as: 'tag_id' }]
    });
  })
  .then((updateData) => res.json(updateData))
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });

    // // update product data
    // Tag.update(req.body, {
    //   where: {
    //     id: req.params.id,
    //   },
    // })
    //   .then( async (tag) => {
    //     // find all associated tags from ProductTag
    //     return(await ProductTag.findAll({ where: { tag_id: req.params.id } }));
    //   })
    //   .then((productTags) => {
    //     // get list of current tag_ids
    //     const productTagIds = productTags.map(({ tag_id }) => tag_id);
    //     // create filtered list of new tag_ids
    //     const newTags = req.body.tagIds
    //       .filter((tag_id) => !productTagIds.includes(tag_id))
    //       .map((tag_id) => {
    //         return {
    //           product_id: req.params.id,
    //           tag_id,
    //         };
    //       });
    //     // figure out which ones to remove
    //     const productTagsToRemove = productTags
    //       .filter(({ tag_id }) => !req.body.tagIds.includes(tag_id))
    //       .map(({ id }) => id);
  
    //     // run both actions
    //     return Promise.all([
    //       ProductTag.destroy({ where: { id: productTagsToRemove } }),
    //       ProductTag.bulkCreate(newTags),
    //     ]);
    //   })
    //   .then(async (updatedProductTags) => {
    //     return(res.status(200).json({ status: `Deleted product id = ${req.params.id}`}));
    //   })    
    //   .catch((err) => {
    //     // console.log(err);
    //     res.status(400).json(err);
    //   });
  
});

router.delete('/:id', async (req, res) => {
  // delete on tag by its `id` value

  // 10/05/2022 BZ - Add logic to remove one product at a time by tag_id.
  const data = await Tag.destroy({
    where: {
        id: req.params.id 
    }
  })
  if(data === 1) {
      return res.status(200).json({ status: `Deleted product id = ${req.params.id}`});
  } else {
      return res.status(404).json({ status: `ERROR: Unable to delete product id = ${req.params.id}`});
  }

});

module.exports = router;
