import React, { useState } from 'react';
import axios from 'axios';
import { CheckCircle, Printer, ArrowRight, Upload, FileText, ShieldCheck, X } from 'lucide-react';

export default function RegisterAsset({ currentUser }) {
  const [formData, setFormData] = useState({
    jurisdiction: '',
    description: '',
    owner: currentUser || '',
    type: '',
    value: ''
  });

  // Estado para visualizar los documentos cargados
  const [documents, setDocuments] = useState([]);
  // Estado para almacenar los archivos reales (File objects)
  const [filesToUpload, setFilesToUpload] = useState([]);

  // ESTADO NUEVO: Fotos del activo
  const [photos, setPhotos] = useState([]); // Previsualizaciones
  const [photoFiles, setPhotoFiles] = useState([]); // Archivos reales

  const [registeredAsset, setRegisteredAsset] = useState(null);
  const [status, setStatus] = useState({ loading: false, error: null });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFilesToUpload(prev => [...prev, ...files]);

    const newDocs = files.map(f => ({
      name: f.name,
      size: (f.size / 1024).toFixed(2) + ' KB',
      type: f.type,
      date: new Date().toLocaleDateString()
    }));
    setDocuments(prev => [...prev, ...newDocs]);
  };

  // NUEVO: Manejo de Fotos
  const handlePhotoChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setPhotoFiles(prev => [...prev, ...files]);
      
      // Crear URLs de previsualización
      const newPhotos = files.map(file => ({
        preview: URL.createObjectURL(file),
        name: file.name
      }));
      setPhotos(prev => [...prev, ...newPhotos]);
    }
  };

  const removePhoto = (index) => {
    setPhotos(prev => prev.filter((_, i) => i !== index));
    setPhotoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ loading: true, error: null });
    setRegisteredAsset(null);

    try {
      const payload = new FormData();
      payload.append('jurisdiction', formData.jurisdiction);
      payload.append('description', formData.description);
      payload.append('owner', formData.owner);
      payload.append('type', formData.type);
      payload.append('value', formData.value);
      
      // Adjuntar documentos legales
      filesToUpload.forEach(file => {
        payload.append('documents', file);
      });

      // NUEVO: Adjuntar fotos
      photoFiles.forEach(file => {
        payload.append('photos', file);
      });

      const response = await axios.post('/api/assets/register', payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      setRegisteredAsset(response.data.data);
      
      // Resetear formulario
      setFormData({ jurisdiction: '', description: '', owner: currentUser || '', type: '', value: '' });
      setDocuments([]);
      setFilesToUpload([]);
      setPhotos([]);
      setPhotoFiles([]);
      setStatus({ loading: false, error: null });
      
    } catch (err) {
      console.error(err);
      setStatus({ 
        loading: false, 
        error: err.response?.data?.error?.message || err.message || 'Registration failed'
      });
    }
  };

  if (registeredAsset) {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${registeredAsset.assetId}`;

    return (
      <div className="max-w-2xl mx-auto animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full mb-4">
            <CheckCircle className="w-8 h-8" />
          </div>
          <h2 className="text-3xl font-bold text-primary">Registration Successful!</h2>
          <p className="text-primary/70 mt-2">Your asset has been submitted to the Qubic blockchain.</p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-primary/10 overflow-hidden">
          <div className="bg-primary text-white p-6 flex justify-between items-center">
            <div>
              <p className="text-white/80 text-xs uppercase tracking-wider font-bold">Asset ID</p>
              <p className="font-mono text-sm md:text-base truncate max-w-[200px] md:max-w-sm">{registeredAsset.assetId}</p>
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-300 text-xs font-bold rounded-full border border-amber-500/50">
              PENDING VERIFICATION
            </div>
          </div>

          <div className="p-8 grid md:grid-cols-[1fr_auto] gap-8 items-center">
            <div className="space-y-4">
              <div>
                <p className="text-xs text-primary/60 uppercase font-bold">Description</p>
                <p className="text-primary font-medium">{registeredAsset.description}</p>
              </div>
              <div>
                <p className="text-xs text-primary/60 uppercase font-bold">Jurisdiction</p>
                <p className="text-primary">{registeredAsset.jurisdiction}</p>
              </div>
              <div>
                <p className="text-xs text-primary/60 uppercase font-bold">Owner</p>
                <p className="text-primary/80 text-sm font-mono truncate">{registeredAsset.owner}</p>
              </div>
              {/* Mostrar si hay fotos subidas */}
              {registeredAsset.documents && registeredAsset.documents.some(d => d.category === 'photo') && (
                 <div>
                   <p className="text-xs text-primary/60 uppercase font-bold">Photos</p>
                   <p className="text-primary text-sm">{registeredAsset.documents.filter(d => d.category === 'photo').length} uploaded</p>
                 </div>
              )}
            </div>

            <div className="flex flex-col items-center bg-surface p-4 rounded-xl border border-primary/10">
              <img src={qrUrl} alt="Asset QR Code" className="w-32 h-32 mix-blend-multiply" />
              <p className="text-[10px] text-primary/60 mt-2 font-medium uppercase tracking-wide">Scan to Verify</p>
            </div>
          </div>

          <div className="bg-surface p-6 flex gap-4 border-t border-primary/10">
            <button 
              onClick={() => window.print()}
              className="flex-1 flex items-center justify-center gap-2 bg-white border border-primary/20 text-primary px-4 py-2 rounded-lg hover:bg-primary/5 hover:border-primary/30 transition-all font-medium"
            >
              <Printer className="w-4 h-4" />
              Print Label
            </button>
            <button 
              onClick={() => setRegisteredAsset(null)}
              className="flex-1 flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-all font-medium shadow-md hover:shadow-lg"
            >
              Register Another
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-primary mb-2">Register New Asset</h2>
      <p className="text-primary/70 mb-8">Submit real-world assets for verification on the Qubic blockchain.</p>

      <div className="bg-white p-8 rounded-xl shadow-sm border border-primary/10">
        {status.error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-start gap-3">
            <div className="mt-1 text-xl">⚠️</div>
            <div>
              <p className="font-bold">Registration Failed</p>
              <p className="text-sm">{status.error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Asset Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white text-primary"
              required
            >
              <option value="">Select Type...</option>
              <option value="Real Estate">Real Estate (Inmueble)</option>
              <option value="Art & Collectibles">Art & Collectibles</option>
              <option value="Vehicle">Luxury Vehicle</option>
              <option value="Commodity">Commodity (Gold, etc)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Jurisdiction</label>
            <select
              name="jurisdiction"
              value={formData.jurisdiction}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all bg-white text-primary"
              required
            >
              <option value="">Select Jurisdiction...</option>
              <option value="PAN" className="font-bold text-emerald-600">🇵🇦 Panama (Recommended - 30% Discount)</option>
              <option value="BVI">British Virgin Islands</option>
              <option value="KYM">Cayman Islands</option>
              <option value="CHE">Switzerland</option>
              <option value="SGP">Singapore</option>
              <option value="USA">United States (Delaware)</option>
            </select>
            {/* Mensaje de Descuento Restaurado */}
            {formData.jurisdiction === 'PAN' && (
              <p className="text-xs text-emerald-600 mt-2 font-medium animate-pulse">
                🎉 Discount applied! Legal fees reduced by 30% for Panama jurisdiction.
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Owner Address (Qubic ID)</label>
            <div className="relative">
              <input
                type="text"
                name="owner"
                value={formData.owner}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface text-primary/70 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none font-mono text-sm cursor-not-allowed"
                placeholder="0x..."
                required
                readOnly
              />
              <button 
                type="button"
                className="absolute right-3 top-3 text-primary/50 hover:text-primary transition-colors"
                title="Address locked to current user"
              >
                <ShieldCheck className="w-5 h-5" /> 
              </button>
            </div>
            <p className="text-xs text-primary/60 mt-1">The public key of the asset owner wallet (You).</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Estimated Value (USD)</label>
            <input
              type="number"
              name="value"
              value={formData.value}
              onChange={handleChange}
              min="0"
              placeholder="e.g. 1250000"
              className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-primary"
              required
            />
            <p className="text-xs text-primary/60 mt-1">Current market value estimation for initial tokenization.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Asset Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="4"
              placeholder="e.g. Luxury Villa located at 123 Ocean Drive, Nassau..."
              className="w-full px-4 py-3 rounded-lg border border-primary/20 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all text-primary"
              required
            ></textarea>
          </div>

          {/* Sección de Fotos Restaurada */}
          <div>
            <label className="block text-sm font-medium text-primary mb-2">Asset Photos (Required)</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {photos.map((photo, idx) => (
                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-primary/20 group">
                  <img src={photo.preview} alt="preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removePhoto(idx)}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
              <label className="border-2 border-dashed border-primary/20 rounded-lg aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-surface transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handlePhotoChange}
                  className="hidden"
                />
                <Upload className="w-6 h-6 text-primary/50 mb-1" />
                <span className="text-xs text-primary/60">Add Photo</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-primary mb-2">Legal Documents (PDF/Images)</label>
            <div className="border-2 border-dashed border-primary/20 rounded-lg p-6 text-center hover:bg-surface transition-colors relative">
              <input 
                type="file" 
                multiple 
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                accept=".pdf,image/*"
              />
              <Upload className="w-8 h-8 text-primary/50 mx-auto mb-2" />
              <p className="text-sm text-primary/70 font-medium">Click to upload or drag and drop</p>
              <p className="text-xs text-primary/60 mt-1">PDF, JPG, PNG (Max 10MB)</p>
            </div>
            
            {documents.length > 0 && (
              <div className="mt-3 space-y-2">
                {documents.map((doc, idx) => (
                  <div key={idx} className="flex items-center p-2 bg-surface rounded border border-primary/10">
                    <FileText className="w-4 h-4 text-primary mr-2" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-primary truncate">{doc.name}</p>
                      <p className="text-xs text-primary/60">{doc.size}</p>
                    </div>
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={status.loading}
            className="w-full bg-primary text-white font-semibold py-4 rounded-lg hover:bg-primary-dark transition-all disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center shadow-lg transform hover:-translate-y-0.5"
          >
            {status.loading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Processing on Blockchain...
              </div>
            ) : (
              "Submit for Verification"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}