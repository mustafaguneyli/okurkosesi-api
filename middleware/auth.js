const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token bulunamadı' });
    }

    const decoded = jwt.verify(token, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9');
    const user = await User.findById(decoded.id || decoded.userId);
    
    if (!user) {
      return res.status(401).json({ message: 'Kullanıcı bulunamadı' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    console.error('Auth middleware hatası:', error);
    res.status(401).json({ message: 'Yetkilendirme hatası' });
  }
};

const isAdmin = async (req, res, next) => {
  try {
    const user = req.user;
    if (user.email === 'mustafa_guneyli21@erdogan.edu.tr') {
      next();
    } else {
      res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
    }
  } catch (error) {
    res.status(401).json({ message: 'Yetkilendirme hatası' });
  }
};

module.exports = { auth, isAdmin }; 