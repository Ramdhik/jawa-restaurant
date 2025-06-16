const mongoose = require('mongoose');

const pesananSchema = new mongoose.Schema(
  {
    nomorPesanan: {
      type: String,
      required: [true, 'Nomor pesanan harus diisi.'],
      unique: true,
      trim: true,
    },
    pelayan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Pesanan harus dicatat oleh seorang pelayan.'],
    },
    chef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    meja: {
      type: String,
      trim: true,
    },
    items: [
      {
        menuItem: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'MenuMakanan',
          required: [true, 'Item pesanan harus merujuk ke menu makanan.'],
        },
        namaItem: {
          // Simpan nama item untuk historical data
          type: String,
          required: true,
        },
        hargaSatuan: {
          // Simpan harga saat ini untuk historical data
          type: Number,
          required: true,
          min: 0,
        },
        kuantitas: {
          type: Number,
          required: [true, 'Kuantitas item harus diisi.'],
          min: [1, 'Kuantitas minimal 1.'],
        },
        catatanItem: {
          type: String,
          trim: true,
        },
      },
    ],
    totalHarga: {
      type: Number,
      required: [true, 'Total harga pesanan harus diisi.'],
      min: [0, 'Total harga tidak boleh negatif.'],
      default: 0,
    },
    status: {
      type: String,
      enum: ['Sedang Diproses', 'Siap Disajikan', 'Selesai'],
      default: 'Sedang Diproses',
      required: true,
    },
    metodePembayaran: {
      type: String,
      enum: ['Tunai', 'Kartu Debit/Kredit', 'QRIS', 'Transfer Bank'],
      default: 'Tunai',
    },
    waktuPesanan: {
      type: Date,
      default: Date.now,
    },
    waktuMulaiPersiapan: {
      type: Date,
    },
    waktuSelesaiPersiapan: {
      type: Date,
    },
    waktuDisajikan: {
      type: Date,
    },
    catatanPesanan: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save hook untuk menghitung totalHarga secara otomatis
pesananSchema.pre('save', function (next) {
  let calculatedTotal = 0;
  this.items.forEach((item) => {
    calculatedTotal += item.kuantitas * item.hargaSatuan;
  });
  this.totalHarga = calculatedTotal;
  next();
});

const Pesanan = mongoose.model('Pesanan', pesananSchema);

module.exports = Pesanan;
