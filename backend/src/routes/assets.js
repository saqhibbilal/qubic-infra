const express = require('express');
const router = express.Router();
const assetController = require('../controllers/assetController');
const { validateAssetRegistration } = require('../middleware/validators');
const upload = require('../middleware/upload');

// Registrar un nuevo activo (Soporta carga de archivos y fotos)
router.post('/register', 
    upload.fields([
        { name: 'documents', maxCount: 5 },
        { name: 'photos', maxCount: 5 }
    ]), 
    validateAssetRegistration, 
    assetController.registerAsset
);

// Listar todos los activos
router.get('/', assetController.getAllAssets);

// Obtener detalles de un activo
router.get('/:assetId', assetController.getAsset);

// Verificar un activo
router.post('/:assetId/verify', assetController.verifyAsset);

module.exports = router;
