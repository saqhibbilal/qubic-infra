import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Building2, Car, Gem, Box, ShieldCheck, Clock, AlertCircle, X, Check, FileText, Wallet, Activity, TrendingUp, Users, ClipboardCheck } from 'lucide-react';

export default function Dashboard({ currentUser }) {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(null);
  
  // Admin Stats
  const [pendingCount, setPendingCount] = useState(0);

  // User Stats
  const [totalValue, setTotalValue] = useState(0);
  const [legalSavings, setLegalSavings] = useState(0);

  // Fake Blockchain Activity Logs (Solo para usuario o decorativo)
  const [logs, setLogs] = useState([
    { time: 'Now', msg: 'Connected to Qubic Network (Mainnet)', type: 'success' },
  ]);

  useEffect(() => {
    if (currentUser) {
      fetchAssets();
      // Simular actividad de blockchain
      const interval = setInterval(() => {
        const actions = [
            'New Block Mined #89212',
            'Validating Node #4A connected',
            'Smart Contract Oracle update',
            'Gas fees optimized: 0.00001 QUBIC',
            'Consensus reached on Block #89213',
            'Verifying Asset Signature...'
        ];
        const randomAction = actions[Math.floor(Math.random() * actions.length)];
        addLog(randomAction, 'info');
      }, 4000);
      return () => clearInterval(interval);
    }
  }, [currentUser]);

  const addLog = (msg, type = 'info') => {
    setLogs(prev => [{ time: 'Just now', msg, type }, ...prev.slice(0, 5)]);
  };

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/assets');
      let allAssets = response.data.data;

      // Calcular estadísticas globales para Admin antes de filtrar
      const pending = allAssets.filter(a => a.status !== 'Verified').length;
      setPendingCount(pending);

      // Filtrar para usuarios normales
      if (currentUser !== 'admin') {
        const normalizedUser = currentUser.toLowerCase().trim();
        allAssets = allAssets.filter(a =>
          a.owner && a.owner.toLowerCase().trim() === normalizedUser
        );

        // Calcular estadísticas personales
        const tvl = allAssets.reduce((sum, asset) => sum + (parseFloat(asset.value) || 0), 0);
        setTotalValue(tvl);
        setLegalSavings(tvl * 0.015); // 1.5% ahorro
      } else {
        // Para Admin, mostramos TODOS los pendientes primero
        allAssets.sort((a, b) => (a.status === 'Verified' ? 1 : -1));
      }

      setAssets(allAssets);
    } catch (error) {
      console.error("Failed to fetch assets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyStep = async (assetId, step) => {
    try {
      setLoading(true);
      // Simulamos retardo de red
      await new Promise(resolve => setTimeout(resolve, 1000));

      await axios.post(`/api/assets/${assetId}/verify`, { verifier: 'Admin', step });

      // Recargar assets para actualizar estado
      fetchAssets();
      
      if (step === null || step === 'full') { // Full verification
         setSelectedAsset(null); // Cerrar modal
         alert("Asset successfully verified and tokenized on Qubic Chain!");
      } else {
        // Actualizar el seleccionado localmente para ver el check verde instantáneo
         setSelectedAsset(prev => ({
             ...prev,
             legalStatus: { ...prev.legalStatus, [step]: 'Verified' }
         }));
      }

    } catch (error) {
      alert("Verification failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getIconByType = (type) => {
    switch (type) {
      case 'Real Estate': return <Building2 className="w-5 h-5 text-blue-500" />;
      case 'Vehicle': return <Car className="w-5 h-5 text-purple-500" />;
      case 'Art & Collectibles': return <Gem className="w-5 h-5 text-pink-500" />;
      default: return <Box className="w-5 h-5 text-slate-500" />;
    }
  };

  // --- VISTA DE ADMIN (VALIDADOR) ---
  if (currentUser === 'admin') {
    const pendingAssets = assets.filter(a => a.status !== 'Verified');
    
    return (
      <div className="animate-fade-in space-y-8">
        <div className="flex justify-between items-center">
            <div>
                <h2 className="text-3xl font-bold text-slate-900">Validator Workstation</h2>
                <p className="text-slate-500">Manage verification requests and legal document reviews.</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-800 text-white px-4 py-2 rounded-lg shadow-sm">
                <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
                <span className="text-xs font-bold uppercase tracking-wider">Node Active</span>
            </div>
        </div>

        {/* Admin Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-amber-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Pending Validations</p>
                        <h3 className="text-4xl font-bold text-slate-900 mt-2">{pendingAssets.length}</h3>
                    </div>
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-lg">
                        <ClipboardCheck className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Requires immediate attention</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-blue-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Collaborators</p>
                        <h3 className="text-4xl font-bold text-slate-900 mt-2">4</h3>
                    </div>
                    <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                        <Users className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Notaries & Lawyers online</p>
            </div>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 border-l-4 border-l-emerald-500">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">System Status</p>
                        <h3 className="text-2xl font-bold text-emerald-600 mt-2">Operational</h3>
                    </div>
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-lg">
                        <Activity className="w-6 h-6" />
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2">Qubic Mainnet Synced</p>
            </div>
        </div>

        {/* Pending Requests Table */}
        <div className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-amber-500" />
                    Verification Queue
                </h3>
                <span className="text-xs font-bold bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                    {pendingAssets.length} Pending
                </span>
            </div>
            
            {pendingAssets.length === 0 ? (
                <div className="p-12 text-center text-slate-400">
                    <Check className="w-16 h-16 mx-auto mb-4 text-emerald-200" />
                    <p className="text-lg font-medium text-slate-600">All caught up!</p>
                    <p>No pending assets to validate.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                        <thead className="bg-white text-slate-500 font-bold border-b border-slate-100 uppercase text-xs tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Asset Description</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Value</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {pendingAssets.map((asset) => (
                                <tr key={asset.assetId} className="hover:bg-amber-50/30 transition-colors">
                                    <td className="px-6 py-4 font-mono text-xs text-slate-500">
                                        {new Date(asset.timestamp).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-slate-800">{asset.description.substring(0, 40)}...</div>
                                        <div className="text-xs text-slate-400 font-mono">Owner: {asset.owner.substring(0, 6)}...{asset.owner.substring(asset.owner.length - 4)}</div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium">
                                            {getIconByType(asset.type)}
                                            {asset.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-mono font-medium text-slate-700">
                                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.value || 0)}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button 
                                            onClick={() => setSelectedAsset(asset)}
                                            className="bg-slate-900 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 ml-auto"
                                        >
                                            <ShieldCheck className="w-3 h-3" />
                                            Validate
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>

        {/* MODAL (Shared with User view but functionality available for Admin) */}
        {selectedAsset && (
             <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} onVerify={handleVerifyStep} isAdmin={true} />
        )}
      </div>
    );
  }

  // --- VISTA DE USUARIO (PROPIETARIO) ---
  return (
    <div className="animate-fade-in relative space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">My Asset Portfolio</h2>
          <p className="text-slate-500">Welcome back, <span className="font-mono font-medium text-slate-700">{currentUser}</span></p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-bold text-slate-600 uppercase tracking-wider">Qubic Network Active</span>
        </div>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-2 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Activity className="w-32 h-32" />
            </div>
            <p className="text-slate-400 text-sm font-medium mb-1 uppercase tracking-wider">Total Value Locked (TVL)</p>
            <h3 className="text-4xl font-bold font-mono mb-2">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(totalValue)}
            </h3>
            <div className="flex items-center gap-2 text-emerald-400 text-sm font-medium">
                <TrendingUp className="w-4 h-4" />
                <span>+12.5% this week</span>
            </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Your Assets</p>
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                    <Box className="w-5 h-5" />
                </div>
            </div>
            <p className="text-3xl font-bold text-slate-900">{assets.length}</p>
            <p className="text-xs text-slate-400 mt-1">Tokenized RWAs</p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
                <p className="text-slate-500 text-sm font-medium">Legal Savings</p>
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <ShieldCheck className="w-5 h-5" />
                </div>
            </div>
            <p className="text-3xl font-bold text-emerald-600">
                {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(legalSavings)}
            </p>
            <p className="text-xs text-slate-400 mt-1">Saved via Panama Jurisdiction</p>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_300px] gap-8">
        {/* LEFT: Asset List */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800">Your Registered Assets</h3>
            </div>
            <div className="overflow-x-auto">
            {assets.length === 0 ? (
                <div className="p-12 text-center text-slate-500">
                <AlertCircle className="w-12 h-12 mx-auto mb-3 text-slate-300" />
                <p>No assets found. Start by registering one!</p>
                </div>
            ) : (
                <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 font-medium border-b border-slate-100">
                    <tr>
                    <th className="px-6 py-3">Asset</th>
                    <th className="px-6 py-3">Type</th>
                    <th className="px-6 py-3">Status</th>
                    <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                    {assets.map((asset) => (
                    <tr key={asset.assetId} className="hover:bg-slate-50 transition-colors cursor-pointer group" onClick={() => setSelectedAsset(asset)}>
                        <td className="px-6 py-4">
                        <div className="font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{asset.description.substring(0, 30)}...</div>
                        <div className="flex items-center gap-1 text-xs text-slate-400 font-mono mt-1">
                             <span className="text-emerald-600 font-bold">{new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.value || 0)}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                            {getIconByType(asset.type)}
                            <span>{asset.type}</span>
                        </div>
                        </td>
                        <td className="px-6 py-4">
                        {asset.status === 'Verified' ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="w-3 h-3" /> Verified
                            </span>
                        ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 border border-amber-200">
                            <Clock className="w-3 h-3" /> Processing
                            </span>
                        )}
                        </td>
                        <td className="px-6 py-4 text-right">
                        <span className="text-slate-400 group-hover:text-blue-600 text-xs font-bold transition-colors">View Details &rarr;</span>
                        </td>
                    </tr>
                    ))}
                </tbody>
                </table>
            )}
            </div>
        </div>

        {/* RIGHT: Blockchain Live Feed */}
        <div className="bg-slate-900 rounded-xl p-4 text-slate-400 font-mono text-xs h-fit border border-slate-800 shadow-lg">
            <div className="flex items-center gap-2 mb-4 pb-2 border-b border-slate-800 text-slate-300">
                <Activity className="w-4 h-4 text-emerald-500" />
                <span className="font-bold">Live Network Activity</span>
            </div>
            <div className="space-y-3 min-h-[200px]">
                {logs.map((log, i) => (
                    <div key={i} className="animate-fade-in">
                        <span className="text-slate-600 mr-2">[{log.time}]</span>
                        <span className={log.type === 'success' ? 'text-emerald-400' : log.type === 'warning' ? 'text-amber-400' : 'text-slate-300'}>
                            {log.msg}
                        </span>
                    </div>
                ))}
            </div>
            <div className="mt-4 pt-2 border-t border-slate-800 text-center text-[10px] text-slate-600 uppercase tracking-widest">
                Qubic Mainnet • Block Height 89,212
            </div>
        </div>
      </div>

      {/* MODAL FOR USERS */}
      {selectedAsset && (
         <AssetModal asset={selectedAsset} onClose={() => setSelectedAsset(null)} onVerify={handleVerifyStep} isAdmin={false} />
      )}
    </div>
  );
}

// COMPONENTE MODAL REUTILIZABLE
function AssetModal({ asset, onClose, onVerify, isAdmin }) {
    const handleVerifyClick = (step) => {
        if (confirm(`Confirm verification step: ${step || 'Full Validation'}?`)) {
            onVerify(asset.assetId, step);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-slate-200">
            <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/50">
              <div>
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  {asset.description}
                  {asset.status === 'Verified' && <ShieldCheck className="w-5 h-5 text-emerald-500" />}
                </h3>
                <p className="text-sm text-slate-500 font-mono mt-1 break-all">ID: {asset.assetId}</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            <div className="grid md:grid-cols-3 h-full">
              {/* Detalles e Imágenes */}
              <div className="md:col-span-2 p-8 space-y-8 border-r border-slate-100">
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Value</label>
                    <p className="text-xl font-bold text-emerald-600">
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(asset.value || 0)}
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Owner</label>
                    <p className="text-slate-600 font-mono text-xs mt-1 truncate p-2 bg-slate-100 rounded border border-slate-200">{asset.owner}</p>
                  </div>
                </div>

                {/* FOTOS */}
                {asset.documents && asset.documents.some(d => d.category === 'photo') && (
                    <div>
                        <h4 className="text-sm font-bold text-slate-900 mb-4">Asset Evidence</h4>
                        <div className="grid grid-cols-3 gap-2">
                            {asset.documents.filter(d => d.category === 'photo').map((photo, idx) => (
                                <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-slate-200 bg-slate-100">
                                    <img src={photo.path || photo.preview} alt="asset" className="w-full h-full object-cover hover:scale-110 transition-transform" />
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* DOCUMENTOS */}
                <div>
                  <h4 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-500" />
                    Legal Documents
                  </h4>
                  <div className="space-y-2">
                    {asset.documents && asset.documents.filter(d => d.category !== 'photo').length > 0 ? (
                      asset.documents.filter(d => d.category !== 'photo').map((doc, i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white rounded-lg border border-slate-200 hover:border-blue-300 transition-colors group shadow-sm">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 bg-red-50 text-red-500 rounded flex items-center justify-center">
                                <FileText className="w-4 h-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-slate-700">{doc.name}</p>
                              <p className="text-xs text-slate-400">{doc.size} • {doc.date}</p>
                            </div>
                          </div>
                          <button className="text-slate-400 group-hover:text-blue-600 text-xs font-bold">View PDF</button>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-slate-400 italic">No documents uploaded.</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Panel de Validación (Derecha) */}
              <div className="p-8 bg-slate-50">
                <h4 className="text-sm font-bold text-slate-900 mb-6 uppercase tracking-wider flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    Verification Process
                </h4>

                <div className="space-y-6 relative">
                  <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-slate-200"></div>

                  {[
                    { id: 'notary', title: 'Notary Validation', desc: 'Identity & Deed Check' },
                    { id: 'cadastre', title: 'Cadastre Check', desc: 'Physical Survey' },
                    { id: 'registry', title: 'Public Registry', desc: 'Final Inscription' }
                  ].map((step, idx) => {
                      const isStepVerified = asset.legalStatus && asset.legalStatus[step.id] === 'Verified';
                      // Para el admin, si no está verificado, puede hacer click para verificar (simulación)
                      
                      return (
                        <div key={idx} className="relative flex gap-4 group">
                            <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center z-10 border-2 transition-colors ${isStepVerified ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-slate-300 text-slate-300'}`}>
                                {isStepVerified ? <Check className="w-4 h-4" /> : <span className="text-xs font-bold">{idx + 1}</span>}
                            </div>
                            <div>
                                <p className={`text-sm font-bold ${isStepVerified ? 'text-slate-900' : 'text-slate-400'}`}>{step.title}</p>
                                <p className="text-xs text-slate-500">{step.desc}</p>
                                
                                {/* Botón de acción granular para Admin */}
                                {isAdmin && !isStepVerified && asset.status !== 'Verified' && (
                                    <button 
                                        onClick={() => handleVerifyClick(step.id)}
                                        className="mt-2 text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded hover:bg-blue-200 transition-colors"
                                    >
                                        Approve Step
                                    </button>
                                )}
                            </div>
                        </div>
                      );
                  })}
                </div>

                {isAdmin && asset.status !== 'Verified' && (
                    <div className="mt-8 pt-6 border-t border-slate-200">
                        <button
                          onClick={() => handleVerifyClick(null)}
                          className="w-full bg-slate-900 text-white py-3 rounded-lg font-bold hover:bg-slate-800 shadow-lg flex items-center justify-center gap-2"
                        >
                          <ShieldCheck className="w-4 h-4" />
                          Complete Validation
                        </button>
                        <p className="text-[10px] text-center text-slate-400 mt-2">This will mint the asset on Qubic Chain</p>
                    </div>
                )}
                
                {asset.status === 'Verified' && (
                     <div className="mt-8 pt-6 border-t border-slate-200 text-center">
                         <div className="inline-flex items-center justify-center w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full mb-2">
                             <Check className="w-6 h-6" />
                         </div>
                         <p className="font-bold text-emerald-700">Officially Verified</p>
                         <p className="text-xs text-emerald-600/70">Recorded on Blockchain</p>
                     </div>
                )}
              </div>
            </div>
          </div>
        </div>
    );
}
