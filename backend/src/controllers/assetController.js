const logger = require('../utils/logger');
const db = require('../db/database');
const qubicCrypto = require('../utils/qubicCrypto');

// Base de datos en memoria (se reinicia al apagar el servidor)
// En un hackathon esto es aceptable. Para prod usaríamos MongoDB/Postgres
let assetsDB = [];

exports.registerAsset = async (req, res, next) => {
  try {
    const { jurisdiction, description, owner, type, value } = req.body;
    
    logger.info(`Registering asset type ${type} for owner: ${owner} with value ${value}`);

    // Procesar archivos subidos (req.files ahora es un objeto con keys)
    let allFiles = [];
    
    // Procesar Documentos Legales
    if (req.files && req.files['documents']) {
      const docs = req.files['documents'].map(file => ({
        category: 'document',
        name: file.originalname,
        path: `/uploads/${file.filename}`,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.mimetype,
        date: new Date().toLocaleDateString()
      }));
      allFiles = [...allFiles, ...docs];
    }

    // Procesar Fotos
    if (req.files && req.files['photos']) {
      const photos = req.files['photos'].map(file => ({
        category: 'photo',
        name: file.originalname,
        path: `/uploads/${file.filename}`,
        size: (file.size / 1024).toFixed(2) + ' KB',
        type: file.mimetype,
        date: new Date().toLocaleDateString()
      }));
      allFiles = [...allFiles, ...photos];
    }

    // Generar Identidad Criptográfica Real de Qubic
    const qubicId = await qubicCrypto.createQubicIdentity();
    const assetId = qubicId.publicId; // Usamos el ID público real de Qubic
    
    // Firmar digitalmente los datos iniciales
    const signatureData = await qubicCrypto.signAssetData(qubicId.seed, {
        owner,
        jurisdiction,
        description,
        value
    });

    const timestamp = new Date().toISOString();
    const initialStatus = "Pending";
    const initialLegalStatus = JSON.stringify({
        notary: 'Pending',
        cadastre: 'Pending',
        registry: 'Pending'
    });

    const query = `INSERT INTO assets (assetId, owner, jurisdiction, description, type, status, documents, legalStatus, timestamp, value) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(query, [
      assetId, 
      owner, 
      jurisdiction, 
      description, 
      type || "Other", 
      initialStatus, 
      JSON.stringify(allFiles), 
      initialLegalStatus,
      timestamp,
      value || 0
    ], function(err) {
      if (err) {
        return next(err);
      }

      res.status(201).json({
        success: true,
        message: "Asset registration initiated",
        data: {
          id: this.lastID,
          assetId: assetId,
          qubicSeed: qubicId.seed, // Devolvemos la seed privada SOLO al creador (para que la guarde)
          signature: signatureData ? signatureData.signature : null,
          owner,
          status: initialStatus,
          documents: allFiles
        }
      });
    });

  } catch (error) {
    next(error);
  }
};

exports.getAllAssets = (req, res, next) => {
  const query = `SELECT * FROM assets ORDER BY id DESC`;
  db.all(query, [], (err, rows) => {
    if (err) return next(err);

    // Parsear JSON strings de vuelta a objetos
    const assets = rows.map(row => ({
      ...row,
      documents: JSON.parse(row.documents || '[]'),
      legalStatus: JSON.parse(row.legalStatus || '{}')
    }));

    res.status(200).json({
      success: true,
      count: assets.length,
      data: assets
    });
  });
};

exports.getAsset = (req, res, next) => {
  const { assetId } = req.params;
  db.get(`SELECT * FROM assets WHERE assetId = ?`, [assetId], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ success: false, error: "Asset not found" });

    const asset = {
      ...row,
      documents: JSON.parse(row.documents || '[]'),
      legalStatus: JSON.parse(row.legalStatus || '{}')
    };

    res.status(200).json({ success: true, data: asset });
  });
};

exports.verifyAsset = (req, res, next) => {
  const { assetId } = req.params;
  const { verifier, step } = req.body; // step opcional para validación por fases

  db.get(`SELECT * FROM assets WHERE assetId = ?`, [assetId], (err, row) => {
    if (err) return next(err);
    if (!row) return res.status(404).json({ success: false, error: "Asset not found" });

    let legalStatus = JSON.parse(row.legalStatus || '{}');
    let status = row.status;
    const verificationDate = new Date().toISOString();

    if (step) {
       legalStatus[step] = 'Verified';
       // Si todos están verificados, marcamos el activo como Verified
       if (legalStatus.notary === 'Verified' && legalStatus.registry === 'Verified') {
         status = 'Verified';
       }
    } else {
      // Verificación total (legacy)
      status = 'Verified';
    }

    const updateQuery = `UPDATE assets SET status = ?, verifier = ?, verificationDate = ?, legalStatus = ? WHERE assetId = ?`;
    
    db.run(updateQuery, [status, verifier || "Admin", verificationDate, JSON.stringify(legalStatus), assetId], function(err) {
      if (err) return next(err);

      res.status(200).json({
        success: true,
        message: "Asset verified successfully",
        data: { assetId, status, legalStatus }
      });
    });
  });
};
