const express = require('express');
const Pesanan = require('../../shared/models/pesanan'); // Import the Pesanan model
const router = express.Router();

// GET all orders
router.get('/pesanans', async (req, res) => {
    try {
        const orders = await Pesanan.find({})

        res.status(200).send(orders);
    } catch (error) {
        console.error('Error fetching all orders:', error);
        res.status(500).json({
            message: 'Internal Server Error',
            error: error.message,
        });
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

// PATCH (update) order by ID
router.patch('/pesanans/:id', async (req, res) => {
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

module.exports = router;