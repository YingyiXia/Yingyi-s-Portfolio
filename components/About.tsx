import React, { useState } from 'react';
import { UserProfile } from '../types';
import { generateBio } from '../services/geminiService';

interface AboutProps {
  profile: UserProfile;
  setProfile: (profile: UserProfile) => void;
  onToast: (msg: string) => void;
}

export const About: React.FC<AboutProps> = ({ profile, setProfile, onToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleAiPolish = async () => {
    if (!profile.bio) return;
    setIsGenerating(true);
    try {
      const polished = await generateBio(profile.bio);
      setProfile({ ...profile, bio: polished });
      onToast("Bio refined by AI");
    } catch (e) {
      onToast("AI Service unavailable");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setProfile({ ...profile, [field]: value });
  };

  return (
    <div className="max-w-3xl mx-auto px-8 py-16 md:py-24 text-center">
      <div className="mb-12 relative inline-block group">
        {profile.avatarUrl ? (
          <img 
            src={profile.avatarUrl} 
            alt="Profile" 
            className="w-32 h-32 md:w-40 md:h-40 rounded-full object-cover mx-auto grayscale group-hover:grayscale-0 transition-all duration-700"
          />
        ) : (
          <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gray-100 mx-auto flex items-center justify-center text-gray-300">
            <span className="text-4xl">?</span>
          </div>
        )}
        
        {isEditing && (
            <div className="mt-4">
                 <input 
                    type="text" 
                    placeholder="Avatar URL (optional)"
                    className="text-xs border-b border-gray-300 text-center w-full focus:outline-none focus:border-black py-1 bg-transparent"
                    value={profile.avatarUrl || ''}
                    onChange={(e) => handleChange('avatarUrl', e.target.value)}
                />
            </div>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-8 animate-fade-in">
          <div>
            <input 
              type="text" 
              value={profile.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className="text-4xl md:text-5xl font-bold text-center w-full border-b border-gray-200 focus:border-black focus:outline-none bg-transparent pb-2 font-serif"
              placeholder="Your Name"
            />
          </div>
          <div>
            <input 
              type="text" 
              value={profile.title}
              onChange={(e) => handleChange('title', e.target.value)}
              className="text-sm uppercase tracking-[0.3em] text-center w-full border-b border-gray-200 focus:border-black focus:outline-none bg-transparent pb-2"
              placeholder="PHOTOGRAPHER / ARTIST"
            />
          </div>
          <div className="relative">
            <textarea 
              value={profile.bio}
              onChange={(e) => handleChange('bio', e.target.value)}
              rows={6}
              className="w-full text-lg leading-relaxed text-gray-700 text-center border p-4 focus:border-black focus:outline-none bg-transparent resize-none font-serif"
              placeholder="Write your story here..."
            />
            {process.env.API_KEY && (
              <button 
                onClick={handleAiPolish}
                disabled={isGenerating || !profile.bio}
                className="absolute bottom-4 right-4 text-xs bg-black text-white px-3 py-1 hover:bg-gray-800 disabled:opacity-30 transition-colors"
              >
                {isGenerating ? "Refining..." : "AI Refine"}
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
             <input 
                type="text"
                placeholder="Email"
                value={profile.email || ''}
                onChange={(e) => handleChange('email', e.target.value)}
                className="text-sm border-b p-2 focus:border-black focus:outline-none bg-transparent"
             />
             <input 
                type="text"
                placeholder="Instagram Handle"
                value={profile.instagram || ''}
                onChange={(e) => handleChange('instagram', e.target.value)}
                className="text-sm border-b p-2 focus:border-black focus:outline-none bg-transparent"
             />
          </div>
          <button 
            onClick={() => setIsEditing(false)}
            className="mt-8 px-8 py-3 bg-black text-white uppercase tracking-widest text-xs hover:bg-gray-800 transition-all"
          >
            Save Profile
          </button>
        </div>
      ) : (
        <div className="animate-fade-in">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-serif">{profile.name}</h1>
          <p className="text-xs uppercase tracking-[0.3em] text-gray-500 mb-8 font-sans">{profile.title}</p>
          <div className="w-12 h-[1px] bg-black mx-auto mb-8"></div>
          <p className="text-lg md:text-xl leading-loose text-gray-800 font-serif max-w-2xl mx-auto">
            {profile.bio}
          </p>
          
          <div className="mt-12 flex justify-center space-x-8 text-sm uppercase tracking-widest font-sans">
             {profile.email && <a href={`mailto:${profile.email}`} className="border-b border-transparent hover:border-black transition-colors">Email</a>}
             {profile.instagram && <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noreferrer" className="border-b border-transparent hover:border-black transition-colors">Instagram</a>}
          </div>

          <button 
            onClick={() => setIsEditing(true)}
            className="mt-16 text-xs text-gray-400 hover:text-black uppercase tracking-widest transition-colors"
          >
            Edit Profile
          </button>
        </div>
      )}
    </div>
  );
};