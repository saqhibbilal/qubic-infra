const express = require('express');
const router = express.Router();
const assetRoutes = require('./assets');

// Agrupar rutas
router.use('/assets', assetRoutes);

// Aquí se agregarían más rutas (verify, tokens, etc.)
// router.use('/verify', verifyRoutes);

module.exports = router;
