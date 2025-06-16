const mongoose = require('mongoose');

const menuMakananSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: [true, 'Nama menu harus diisi.'],
      unique: true,
      trim: true,
    },
    deskripsi: {
      type: String,
      trim: true,
    },
    harga: {
      type: Number,
      required: [true, 'Harga menu harus diisi.'],
      min: [0, 'Harga tidak boleh negatif.'],
    },
    kategori: {
      type: String,
      enum: ['Makanan Utama', 'Minuman', 'Dessert', 'Pembuka', 'Snack', 'Lain-lain'],
      default: 'Makanan Utama',
    },
    bahan: {
      type: [String],
      default: [],
    },
    gambarUrl: {
      type: String,
      trim: true,
    },
    statusKetersediaan: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const MenuMakanan = mongoose.model('MenuMakanan', menuMakananSchema);

module.exports = MenuMakanan;
