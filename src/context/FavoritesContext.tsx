import React, { createContext, ReactNode, useContext, useState } from 'react';

// Types
export type FavoriteUniversity = {
  id: string;
  name: string;
  location: string;
  fee: string;
};

type FavoritesContextType = {
  favoriteUniversities: FavoriteUniversity[];
  addToFavorites: (university: FavoriteUniversity) => void;
  removeFromFavorites: (universityId: string) => void;
  isFavorite: (universityId: string) => boolean;
};

// Create Context
const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

// Provider Component
export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favoriteUniversities, setFavoriteUniversities] = useState<FavoriteUniversity[]>([]);

  const addToFavorites = (university: FavoriteUniversity) => {
    setFavoriteUniversities(prev => {
      // Check if already exists
      if (prev.some(fav => fav.id === university.id)) {
        return prev;
      }
      return [...prev, university];
    });
  };

  const removeFromFavorites = (universityId: string) => {
    setFavoriteUniversities(prev => prev.filter(fav => fav.id !== universityId));
  };

  const isFavorite = (universityId: string) => {
    return favoriteUniversities.some(fav => fav.id === universityId);
  };

  return (
    <FavoritesContext.Provider value={{
      favoriteUniversities,
      addToFavorites,
      removeFromFavorites,
      isFavorite
    }}>
      {children}
    </FavoritesContext.Provider>
  );
};

// Custom Hook
export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};