const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

  // // Mengambil token dari header
  // const authHeader = req.header('Authorization');
  // if (authHeader && authHeader.startsWith('Bearer ')) {
  //     token = authHeader.split(' ')[1];
  // }

  // // Jika tidak ada di header, coba dari HttpOnly cookie
  // // Pastikan Anda sudah menggunakan 'cookie-parser' di app.js
  // if (!token && req.cookies && req.cookies.jwt) { // 'jwt' adalah nama cookie Anda
  //     token = req.cookies.jwt;
  // }

  if (!token) {
    return res.status(401).json({ message: 'Akses ditolak. Token tidak ada.' });
  } 

  console.log('Token Middleware:', token);

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ message: 'Token telah kadaluarsa' });
    }
    
    res.status(401).json({ message: 'Token tidak valid' });
  }
};
