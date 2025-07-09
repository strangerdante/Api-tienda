const User = require('../models/User');

const getMe = async (req, res) => {
  try {
    res.json({
      success: true,
      user: req.user.toPublic()
    });
  } catch (error) {
    console.error('Error obteniendo datos del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getMe
};