import React, { useState, useEffect } from 'react';
import { Navigation } from './components/Navigation';
import { PhotoGrid } from './components/PhotoGrid';
import { About } from './components/About';
import { Upload } from './components/Upload';
import { Photo, UserProfile, ViewState, ToastMessage } from './types';

export default function App() {
  return (
    <h1 style={{ fontSize: "40px", textAlign: "center", marginTop: "100px" }}>
      Hi, this is working!
    </h1>
  );
}

// Initial Mock Data
const INITIAL_PHOTOS: Photo[] = [
  {
    id: '1',
    url: 'https://picsum.photos/800/1200?grayscale&random=1',
    title: 'Solitude',
    description: 'A quiet moment in the chaotic city.',
    dateAdded: Date.now()
  },
  {
    id: '2',
    url: 'https://picsum.photos/800/1000?grayscale&random=2',
    title: 'Architecture I',
    description: 'Lines and shadows converging in light.',
    dateAdded: Date.now() - 10000
  },
  {
    id: '3',
    url: 'https://picsum.photos/800/800?grayscale&random=3',
    title: 'Texture Study',
    description: 'The feeling of stone worn by time.',
    dateAdded: Date.now() - 20000
  },
  {
    id: '4',
    url: 'https://picsum.photos/800/1100?grayscale&random=4',
    title: 'Portrait of Stranger',
    description: 'Eyes that tell a thousand unwritten stories.',
    dateAdded: Date.now() - 30000
  }
];

const INITIAL_PROFILE: UserProfile = {
  name: "Alexandre Voss",
  title: "Visual Artist",
  bio: "Capturing the silence between thoughts. My work explores the interplay of light and shadow in urban environments, seeking the sublime in the ordinary. Based in Paris.",
  email: "contact@lumiere.example",
  instagram: "lumiere_voss"
};

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('GALLERY');
  const [photos, setPhotos] = useState<Photo[]>(() => {
    const saved = localStorage.getItem('lumiere_photos');
    return saved ? JSON.parse(saved) : INITIAL_PHOTOS;
  });
  
  const [profile, setProfile] = useState<UserProfile>(() => {
     const saved = localStorage.getItem('lumiere_profile');
     return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Persistence
  useEffect(() => {
    localStorage.setItem('lumiere_photos', JSON.stringify(photos));
  }, [photos]);

  useEffect(() => {
    localStorage.setItem('lumiere_profile', JSON.stringify(profile));
  }, [profile]);

  const addToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handleUpload = (photo: Photo) => {
    setPhotos(prev => [photo, ...prev]);
    setView('GALLERY');
    addToast('Photo added successfully', 'success');
  };

  const handleRemovePhoto = (id: string) => {
    if (confirm('Are you sure you want to remove this piece?')) {
        setPhotos(prev => prev.filter(p => p.id !== id));
        addToast('Photo removed');
    }
  };

  return (
    <div className="min-h-screen bg-white text-black font-serif selection:bg-gray-200">
      <Navigation currentView={view} setCurrentView={setView} />
      
      <main className="animate-fade-in-up">
        {view === 'GALLERY' && <PhotoGrid photos={photos} onRemove={handleRemovePhoto} />}
        {view === 'ABOUT' && <About profile={profile} setProfile={setProfile} onToast={addToast} />}
        {view === 'UPLOAD' && (
            <Upload 
                onUpload={handleUpload} 
                onToast={addToast} 
                onCancel={() => setView('GALLERY')} 
            />
        )}
      </main>

      {/* Footer */}
      <footer className="w-full py-12 text-center text-[10px] uppercase tracking-widest text-gray-400 font-sans mt-12 border-t border-gray-50">
        &copy; {new Date().getFullYear()} Lumière Portfolio. All rights reserved.
      </footer>

      {/* Toast Notification */}
      <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50 flex flex-col gap-2">
        {toasts.map(toast => (
            <div 
                key={toast.id}
                className="bg-black text-white px-6 py-3 text-xs uppercase tracking-widest shadow-xl animate-fade-in-up"
            >
                {toast.message}
            </div>
        ))}
      </div>
    </div>
  );
};

export default App;
