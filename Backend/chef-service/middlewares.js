const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('Authorization')?.split(' ')[1]; // "Bearer <token>"

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
