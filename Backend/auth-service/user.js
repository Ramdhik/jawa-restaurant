const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    namaLengkap: {
      type: String,
      required: [true, 'Nama lengkap harus diisi.'],
      trim: true,
    },
    username: {
      type: String,
      required: [true, 'Username harus diisi.'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [false, 'Password harus diisi.'],
      minlength: [6, 'Password minimal 6 karakter.'],
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Silakan masukkan alamat email yang valid.'],
    },
    telepon: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      required: [true, 'Role pengguna harus diisi.'],
      enum: ['Admin', 'Manajer', 'Kasir', 'Pelayan', 'Chef'],
      default: 'Pelayan',
    },
    aktif: {
      type: Boolean,
      default: true,
    },
    googleId: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
    },
    isProfileComplete: {
      type: Boolean,
      default: false,
    }
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);

module.exports = User;
