export interface Photo {
  id: string;
  url: string;
  title: string;
  description?: string;
  dateAdded: number;
  width?: number;
  height?: number;
}

export interface UserProfile {
  name: string;
  title: string;
  bio: string;
  avatarUrl?: string;
  email?: string;
  instagram?: string;
}

export type ViewState = 'GALLERY' | 'ABOUT' | 'UPLOAD';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}