import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { RecipeSummary } from '../types/recipe';

interface FavoritesContextType {
  favorites: RecipeSummary[];
  addFavorite: (recipe: RecipeSummary) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const FavoritesProvider = ({ children }: { children: ReactNode }) => {
  const [favorites, setFavorites] = useState<RecipeSummary[]>([]);

  const addFavorite = useCallback((recipe: RecipeSummary) => {
    setFavorites(prev => prev.some(fav => fav.idMeal === recipe.idMeal) ? prev : [...prev, recipe]);
  }, []);

  const removeFavorite = useCallback((id: string) => {
    setFavorites(prev => prev.filter(recipe => recipe.idMeal !== id));
  }, []);

  const isFavorite = useCallback((id: string) => favorites.some(recipe => recipe.idMeal === id), [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) throw new Error('useFavorites must be used within a FavoritesProvider');
  return context;
};