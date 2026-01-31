const db = require('./src/db/database');

const sampleAssets = [
  {
    owner: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F",
    jurisdiction: "PAN",
    description: "Luxury Oceanfront Villa in Santa Maria Golf & Country Club. 5 Bedrooms, Infinity Pool, Smart Home Integration.",
    type: "Real Estate",
    status: "Verified",
    value: 2500000,
    legalStatus: JSON.stringify({ notary: 'Verified', cadastre: 'Verified', registry: 'Verified' }),
    documents: JSON.stringify([
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1613490493576-2f1c32120937?auto=format&fit=crop&w=800&q=80', name: 'villa_front.jpg' },
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&w=800&q=80', name: 'living_room.jpg' }
    ])
  },
  {
    owner: "0x8921236EC7ab88b098defB751B7401B5f6d84211",
    jurisdiction: "USA",
    description: "Tesla Model S Plaid 2024 - Midnight Silver Metallic. Full Self-Driving Capability, 1020 hp.",
    type: "Vehicle",
    status: "Verified",
    value: 135000,
    legalStatus: JSON.stringify({ notary: 'Verified', cadastre: 'Verified', registry: 'Verified' }),
    documents: JSON.stringify([
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1617788138017-80ad40651399?auto=format&fit=crop&w=800&q=80', name: 'tesla_s.jpg' }
    ])
  },
  {
    owner: "0x3215456EC7ab88b098defB751B7401B5f6d81122",
    jurisdiction: "SGP",
    description: "Bored Ape Yacht Club #8812 - Original NFT with Commercial Rights. Rare Trait: Gold Fur.",
    type: "Art & Collectibles",
    status: "Verified",
    value: 120000,
    legalStatus: JSON.stringify({ notary: 'Verified', cadastre: 'Verified', registry: 'Verified' }),
    documents: JSON.stringify([
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1620641788421-7a1c342ea42e?auto=format&fit=crop&w=800&q=80', name: 'ape_art.jpg' }
    ])
  },
  {
    owner: "0xAdminValidatorWallet",
    jurisdiction: "PAN",
    description: "Global Bank Tower - Floor 32. Full commercial office space, 500m2. Prime financial district location.",
    type: "Real Estate",
    status: "Verified",
    value: 1500000,
    legalStatus: JSON.stringify({ notary: 'Verified', cadastre: 'Verified', registry: 'Verified' }),
    documents: JSON.stringify([
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80', name: 'office_tower.jpg' }
    ])
  },
  {
    owner: "0x9988776EC7ab88b098defB751B7401B5f6d83344",
    jurisdiction: "BVI",
    description: "Sunseeker Manhattan 68 Yacht. 4 Cabins, Flybridge, Twin MAN V8 engines.",
    type: "Vehicle",
    status: "Verified",
    value: 1850000,
    legalStatus: JSON.stringify({ notary: 'Verified', cadastre: 'Verified', registry: 'Verified' }),
    documents: JSON.stringify([
        { category: 'photo', preview: 'https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=800&q=80', name: 'yacht.jpg' }
    ])
  }
];

console.log("🌱 Seeding database with premium assets...");

const insertAsset = (asset) => {
  const mockAssetId = "0x" + Math.random().toString(16).substr(2, 32);
  const timestamp = new Date().toISOString();

  const query = `INSERT INTO assets (assetId, owner, jurisdiction, description, type, status, documents, legalStatus, timestamp, value, verifier, verificationDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  
  db.run(query, [
    mockAssetId, 
    asset.owner, 
    asset.jurisdiction, 
    asset.description, 
    asset.type, 
    asset.status, 
    asset.documents, 
    asset.legalStatus,
    timestamp,
    asset.value,
    'System Admin',
    timestamp
  ], (err) => {
    if (err) console.error("Error inserting asset:", err.message);
    else console.log(`✅ Inserted: ${asset.description.substring(0, 20)}...`);
  });
};

// Esperar a que la DB conecte
setTimeout(() => {
    sampleAssets.forEach(insertAsset);
}, 1000);
