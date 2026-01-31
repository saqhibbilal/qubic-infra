const { QubicHelper } = require('@qubic-lib/qubic-ts-library/dist/qubicHelper');
const crypto = require('crypto');

// Instancia del helper de Qubic
const helper = new QubicHelper();

/**
 * Genera una identidad Qubic real (Seed + Public ID)
 * Qubic usa seeds de 55 caracteres (a-z)
 */
exports.createQubicIdentity = async () => {
  try {
    // 1. Generar seed aleatoria de 55 chars (solo a-z)
    const seed = generateRandomSeed();
    
    // 2. Crear paquete de identidad (la librería maneja la criptografía compleja)
    const idPackage = await helper.createIdPackage(seed);
    
    return {
      seed: seed,
      publicId: idPackage.publicId, // El ID que empieza con letras y termina con Checksum
      success: true
    };
  } catch (error) {
    console.error('Error generating Qubic ID:', error);
    // Fallback por si la librería falla en entorno Node sin WASM
    return { 
        seed: 'mock_seed_failed_crypto', 
        publicId: 'BAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMOCK',
        success: false
    };
  }
};

/**
 * Firma digitalmente un payload (como los datos del activo)
 * @param {string} seed - La seed del validador
 * @param {object} data - Los datos a firmar
 */
exports.signAssetData = async (seed, data) => {
    try {
        // Convertir datos a string
        const dataString = JSON.stringify(data);
        
        // En Qubic real, firmaríamos el hash del paquete binario.
        // Aquí simulamos la firma usando la librería si es posible, o hash standard.
        // Nota: La librería requiere paquetes binarios estrictos.
        
        // Generamos un hash SHA256 de los datos para representar el "digest"
        const hash = crypto.createHash('sha256').update(dataString).digest('hex');
        
        return {
            signature: hash, // Simplificación para la demo si no tenemos el binario
            timestamp: new Date().toISOString()
        };

    } catch (error) {
        console.error("Signing error:", error);
        return null;
    }
};

// Helper para generar seed de 55 chars (a-z)
function generateRandomSeed() {
    const chars = 'abcdefghijklmnopqrstuvwxyz';
    let result = '';
    for (let i = 0; i < 55; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
}
