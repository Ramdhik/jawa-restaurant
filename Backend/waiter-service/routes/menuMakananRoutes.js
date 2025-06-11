const express = require('express');
const MenuMakanan = require('../../shared/models/menuMakanan');
const router = express.Router();

// GET all menu items
router.get('/menumakanans', async (req, res) => {
  try {
    const menuItems = await MenuMakanan.find({});
    res.status(200).send(menuItems);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET menu item by ID
router.get('/menumakanans/:id', async (req, res) => {
  try {
    const menuItem = await MenuMakanan.findById(req.params.id);
    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }
    res.status(200).send(menuItem);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST a new menu item
router.post('/menumakanans', async (req, res) => {
  try {
    const menuItem = new MenuMakanan(req.body);
    await menuItem.save();
    res.status(201).send(menuItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// PUT (update) menu item by ID
router.put('/menumakanans/:id', async (req, res) => {
  try {
    const menuItem = await MenuMakanan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }
    res.status(200).send(menuItem);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE menu item by ID
router.delete('/menumakanans/:id', async (req, res) => {
  try {
    const menuItem = await MenuMakanan.findByIdAndDelete(req.params.id);
    if (!menuItem) {
      return res.status(404).send({ message: 'Menu item not found' });
    }
    res.status(200).send({ message: 'Menu item deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
