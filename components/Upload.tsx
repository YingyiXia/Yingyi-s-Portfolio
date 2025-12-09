import React, { useState, useRef } from 'react';
import { generateImageCaption } from '../services/geminiService';
import { Photo } from '../types';

interface UploadProps {
  onUpload: (photo: Photo) => void;
  onToast: (msg: string) => void;
  onCancel: () => void;
}

export const Upload: React.FC<UploadProps> = ({ onUpload, onToast, onCancel }) => {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [metadata, setMetadata] = useState({
    title: '',
    description: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleAnalyze = async () => {
    if (!preview) return;
    setAnalyzing(true);
    try {
      const result = await generateImageCaption(preview);
      setMetadata({
        title: result.title,
        description: result.description
      });
      onToast("AI generated title and description");
    } catch (e) {
      onToast("Could not analyze image");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleConfirm = () => {
    if (!preview || !metadata.title) {
        onToast("Please provide at least an image and a title.");
        return;
    }

    setLoading(true);
    // Simulate upload delay
    setTimeout(() => {
        const newPhoto: Photo = {
            id: Date.now().toString(),
            url: preview,
            title: metadata.title,
            description: metadata.description,
            dateAdded: Date.now()
        };
        onUpload(newPhoto);
        setLoading(false);
    }, 800);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-serif mb-12 text-center">New Entry</h2>
      
      <div className="flex flex-col md:flex-row gap-12 items-start">
        {/* Left: Image Preview Area */}
        <div className="w-full md:w-1/2">
            <div 
                className={`w-full aspect-[3/4] border border-dashed border-gray-300 flex flex-col items-center justify-center relative bg-gray-50 transition-colors ${!preview ? 'hover:bg-gray-100 cursor-pointer' : ''}`}
                onClick={() => !preview && fileInputRef.current?.click()}
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={(e) => {
                                e.stopPropagation();
                                setFile(null);
                                setPreview(null);
                                setMetadata({title: '', description: ''});
                            }}
                            className="absolute top-2 right-2 bg-white/80 p-2 text-xs uppercase tracking-widest hover:bg-white"
                        >
                            Change
                        </button>
                    </>
                ) : (
                    <div className="text-center p-8">
                        <span className="text-4xl font-light text-gray-300 block mb-4">+</span>
                        <p className="uppercase tracking-widest text-xs text-gray-500">Select Image</p>
                    </div>
                )}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    className="hidden" 
                    accept="image/*"
                    onChange={handleFileChange}
                />
            </div>
            
            {preview && process.env.API_KEY && (
                <button
                    onClick={handleAnalyze}
                    disabled={analyzing}
                    className="mt-4 w-full py-3 border border-gray-200 text-xs uppercase tracking-widest hover:border-black disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
                >
                    {analyzing ? (
                        <>
                           <span className="w-2 h-2 bg-black rounded-full animate-ping"></span> 
                           Analyzing...
                        </>
                    ) : (
                        <>✨ Auto-Generate Metadata</>
                    )}
                </button>
            )}
        </div>

        {/* Right: Metadata Form */}
        <div className="w-full md:w-1/2 space-y-8 pt-4">
            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400">Title</label>
                <input 
                    type="text" 
                    value={metadata.title}
                    onChange={(e) => setMetadata({...metadata, title: e.target.value})}
                    placeholder="Untitled"
                    className="w-full text-2xl font-serif border-b border-gray-200 pb-2 focus:border-black focus:outline-none bg-transparent placeholder-gray-300"
                />
            </div>

            <div className="space-y-2">
                <label className="text-xs uppercase tracking-widest text-gray-400">Description</label>
                <textarea 
                    rows={4}
                    value={metadata.description}
                    onChange={(e) => setMetadata({...metadata, description: e.target.value})}
                    placeholder="Add a poetic description..."
                    className="w-full text-sm leading-relaxed border-b border-gray-200 pb-2 focus:border-black focus:outline-none bg-transparent placeholder-gray-300 resize-none font-serif"
                />
            </div>

            <div className="pt-12 flex gap-4">
                <button 
                    onClick={onCancel}
                    className="flex-1 py-4 text-xs uppercase tracking-widest text-gray-400 hover:text-black transition-colors"
                >
                    Cancel
                </button>
                <button 
                    onClick={handleConfirm}
                    disabled={loading || !preview}
                    className="flex-1 py-4 bg-black text-white text-xs uppercase tracking-widest hover:bg-gray-800 disabled:opacity-50 transition-colors"
                >
                    {loading ? 'Publishing...' : 'Publish to Gallery'}
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};