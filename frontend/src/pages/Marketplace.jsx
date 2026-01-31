import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Building2, Car, Gem, MapPin, ShieldCheck, ExternalLink, Image as ImageIcon } from 'lucide-react';

export default function Marketplace() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('all');

  useEffect(() => {
    fetchVerifiedAssets();
  }, []);

  const fetchVerifiedAssets = async () => {
    try {
      const response = await axios.get('/api/assets');
      // Solo mostramos los verificados en el marketplace
      const verified = response.data.data.filter(a => a.status === 'Verified');
      setAssets(verified);
    } catch (error) {
      console.error("Failed to fetch marketplace assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssets = category === 'all' 
    ? assets 
    : assets.filter(a => a.type === category);

  const getCategoryIcon = (type) => {
    switch(type) {
      case 'Real Estate': return <Building2 className="w-4 h-4" />;
      case 'Vehicle': return <Car className="w-4 h-4" />;
      case 'Art & Collectibles': return <Gem className="w-4 h-4" />;
      default: return <ShieldCheck className="w-4 h-4" />;
    }
  };

  // Función auxiliar para obtener la imagen principal
  const getAssetImage = (asset) => {
    if (asset.documents && asset.documents.length > 0) {
      const photo = asset.documents.find(d => d.category === 'photo');
      if (photo) return photo.path || photo.preview;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 mb-10 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-4xl font-bold mb-4">Verified Asset Marketplace</h1>
          <p className="text-slate-300 text-lg mb-6">
            Browse real-world assets that have been legally verified and registered on the Qubic blockchain.
          </p>
          <div className="flex gap-2 flex-wrap">
            {['all', 'Real Estate', 'Vehicle', 'Art & Collectibles'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  category === cat 
                    ? 'bg-white text-slate-900' 
                    : 'bg-white/10 text-white hover:bg-white/20'
                }`}
              >
                {cat === 'all' ? 'All Assets' : cat}
              </button>
            ))}
          </div>
        </div>
        {/* Decorative Circles */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl -mr-16 -mt-16"></div>
        <div className="absolute bottom-0 right-20 w-48 h-48 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Grid */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Building2 className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No listings found</h3>
          <p className="text-slate-500">There are currently no verified assets in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAssets.map((asset) => {
            const imageUrl = getAssetImage(asset);
            
            return (
            <div key={asset.assetId} className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group flex flex-col h-full">
              {/* Image Header */}
              <div className="h-48 bg-slate-100 relative flex items-center justify-center overflow-hidden">
                {imageUrl ? (
                    <img src={imageUrl} alt={asset.description} className="w-full h-full object-cover hover:scale-110 transition-transform duration-500" />
                ) : (
                    <div className="flex flex-col items-center text-slate-300">
                        {asset.type === 'Real Estate' && <Building2 className="w-12 h-12" />}
                        {asset.type === 'Vehicle' && <Car className="w-12 h-12" />}
                        {asset.type === 'Art & Collectibles' && <Gem className="w-12 h-12" />}
                        <span className="text-xs mt-2 font-medium">No Image Available</span>
                    </div>
                )}
                
                <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-slate-900 flex items-center gap-1 shadow-sm z-10">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Verified
                </div>

                {asset.value && (
                   <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-sm px-3 py-1 rounded-lg text-white text-sm font-bold shadow-sm z-10">
                     {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.value)}
                   </div>
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 text-xs font-bold text-blue-600 mb-2 uppercase tracking-wider">
                  {getCategoryIcon(asset.type)}
                  {asset.type}
                </div>
                
                <h3 className="font-bold text-slate-900 text-lg mb-2 line-clamp-2">{asset.description}</h3>
                
                <div className="flex items-start gap-2 text-slate-500 text-sm mb-4 flex-1">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span className="line-clamp-1">{asset.jurisdiction === 'PAN' ? 'Panama City, Panama' : asset.jurisdiction}</span>
                </div>

                <div className="border-t border-slate-100 pt-4 flex items-center justify-between mt-auto">
                  <div>
                    <p className="text-xs text-slate-400 font-mono">Owner: {asset.owner.substring(0, 6)}...</p>
                  </div>
                  <button className="text-blue-600 text-sm font-bold flex items-center gap-1 group-hover:gap-2 transition-all">
                    View Details
                    <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )})}
        </div>
      )}
    </div>
  );
}
