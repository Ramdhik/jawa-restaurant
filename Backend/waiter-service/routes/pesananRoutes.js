const express = require('express');
const Pesanan = require('../../shared/models/pesanan'); // Import the Pesanan model
const router = express.Router();
const Counter = require('../../shared/models/nomorPesanan');

router.post('/pesanans', async (req, res) => {
  let counterIncremented = false; // Flag untuk melacak apakah counter sudah diinkremen
  let generatedNomorPesanan = null; // Untuk menyimpan nomor pesanan yang digenerate

  try {
    // Hanya generate nomorPesanan jika tidak disediakan di request body
    if (!req.body.nomorPesanan) {
      const counter = await Counter.findByIdAndUpdate(
        { _id: 'pesananId' }, // ID untuk counter pesanan
        { $inc: { seq: 1 } }, // Inkremen nilai seq
        { new: true, upsert: true } // Mengembalikan document yang sudah diupdate, membuat jika belum ada
      );
      const paddedSeq = String(counter.seq).padStart(3, '0');
      generatedNomorPesanan = `ORD-${paddedSeq}`;
      req.body.nomorPesanan = generatedNomorPesanan; // Set nomorPesanan di body
      counterIncremented = true; // Tandai bahwa counter sudah diinkremen
    }

    const order = new Pesanan(req.body); // Buat instance Pesanan
    await order.save(); // Coba simpan pesanan. Validasi 'unique' akan berjalan di sini.

    res.status(201).send(order); // Kirim respons sukses
  } catch (error) {
    // Error rollback counter
    if (counterIncremented) {
      try {
        await Counter.findByIdAndUpdate(
          { _id: 'pesananId' },
          { $inc: { seq: -1 } }, // Dekremen counter
          { new: true } // Mengembalikan document yang sudah diupdate
        );
        console.warn(`Counter untuk pesananId didekremen karena kegagalan menyimpan pesanan: ${generatedNomorPesanan}`);
      } catch (rollbackError) {
        console.error('Gagal melakukan rollback counter:', rollbackError);
      }
    }

    console.error('Error membuat pesanan:', error);
    // Tangani error duplikasi nomor pesanan
    if (error.code === 11000) {
      // MongoDB duplicate key error code
      return res.status(409).send({
        message: `Nomor pesanan '${req.body.nomorPesanan}' sudah ada.`,
        error: error.message,
      });
    }
    res.status(400).send(error); // Kirim error lain
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
