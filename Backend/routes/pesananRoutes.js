const express = require('express');
const Pesanan = require('../models/Pesanan'); // Import the Pesanan model
const router = express.Router();

// GET all orders
router.get('/pesanans', async (req, res) => {
  try {
    // Populate pelayan and chef fields with full user details
    const orders = await Pesanan.find({}).populate('pelayan', 'namaLengkap role').populate('chef', 'namaLengkap role').populate('items.menuItem', 'nama harga');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send(error);
  }
});

// GET order by ID
router.get('/pesanans/:id', async (req, res) => {
  try {
    const order = await Pesanan.findById(req.params.id).populate('pelayan', 'namaLengkap role').populate('chef', 'namaLengkap role').populate('items.menuItem', 'nama harga');
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.status(200).send(order);
  } catch (error) {
    res.status(500).send(error);
  }
});

// POST a new order
router.post('/pesanans', async (req, res) => {
  try {
    const order = new Pesanan(req.body);
    await order.save();
    res.status(201).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// PUT (update) order by ID
router.put('/pesanans/:id', async (req, res) => {
  try {
    const order = await Pesanan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    await order.save(); // Trigger pre-save hook totalHarga
    res.status(200).send(order);
  } catch (error) {
    res.status(400).send(error);
  }
});

// DELETE order by ID
router.delete('/pesanans/:id', async (req, res) => {
  try {
    const order = await Pesanan.findByIdAndDelete(req.params.id);
    if (!order) {
      return res.status(404).send({ message: 'Order not found' });
    }
    res.status(200).send({ message: 'Order deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;
