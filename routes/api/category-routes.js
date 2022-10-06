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

  // 10/05/2022 BZ - Added logic to return all categories.
  try {
    const categoryData = await Category.findAll({
      include: [{ model: Product }],
    });
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
});

router.get('/:id', async (req, res) => {
  // find one category by its `id` value
  // be sure to include its associated Products

  // 10/05/2022 BZ - Added logic to find one category by its id.
  try {
    const categoryData = await Category.findByPk(req.params.id, {
      include: [{ model: Product }],
    });
    if (!categoryData) {
      res.status(404).json({ message: 'No category found with that id!' });
      return;
    }
    res.status(200).json(categoryData);
  } catch (err) {
    res.status(500).json(err);
  }
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

  // 10/05/2022 BZ - Added update logic for category.
  // update catagory by its id.
  await Category.update(req.body, {
    where: {
      id: req.params.id,
    },
  })
  .then(async (catagory) => {
    // find all associated catagories from catagory id.
    return await Category.findAll({ where: { id: catagory.id } });
  })
  .then((updateData) => res.json(updateData))
  .catch((err) => {
    // console.log(err);
    res.status(400).json(err);
  });

});

router.delete('/:id', async (req, res) => {
  // delete a category by its `id` value

  // 10/05/2022 BZ - Add delete logic for category.
  const data = await Category.destroy({
    where: {
        id: req.params.id 
    }
  })
  if(data === 1) {
      return res.json({ status: `Deleted category id = ${req.params.id}`});
  } else {
      return res.json({ status: `ERROR: Unable to delete category id = ${req.params.id}`});
  }

});

module.exports = router;
