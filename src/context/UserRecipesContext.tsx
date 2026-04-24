import React, { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Recipe } from '../types/recipe';

const USER_RECIPES_KEY = '@user_recipes';

interface UserRecipesContextType {
  userRecipes: Recipe[];
  addUserRecipe: (recipe: Recipe) => Promise<void>;
  updateUserRecipe: (recipe: Recipe) => Promise<void>;
  deleteUserRecipe: (id: string) => Promise<void>;
  getUserRecipe: (id: string) => Recipe | undefined;
}

const UserRecipesContext = createContext<UserRecipesContextType | undefined>(undefined);

export const UserRecipesProvider = ({ children }: { children: ReactNode }) => {
  const [userRecipes, setUserRecipes] = useState<Recipe[]>([]);

  useEffect(() => {
    loadUserRecipes();
  }, []);

  const loadUserRecipes = async () => {
    try {
      const stored = await AsyncStorage.getItem(USER_RECIPES_KEY);
      if (stored) {
        setUserRecipes(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load user recipes:', error);
    }
  };

  const saveUserRecipes = async (recipes: Recipe[]) => {
    try {
      await AsyncStorage.setItem(USER_RECIPES_KEY, JSON.stringify(recipes));
    } catch (error) {
      console.error('Failed to save user recipes:', error);
    }
  };

  const addUserRecipe = useCallback(async (recipe: Recipe) => {
    const updated = [...userRecipes, recipe];
    setUserRecipes(updated);
    await saveUserRecipes(updated);
  }, [userRecipes]);

  const updateUserRecipe = useCallback(async (updatedRecipe: Recipe) => {
    const updated = userRecipes.map(recipe =>
      recipe.idMeal === updatedRecipe.idMeal ? updatedRecipe : recipe
    );
    setUserRecipes(updated);
    await saveUserRecipes(updated);
  }, [userRecipes]);

  const deleteUserRecipe = useCallback(async (id: string) => {
    const updated = userRecipes.filter(recipe => recipe.idMeal !== id);
    setUserRecipes(updated);
    await saveUserRecipes(updated);
  }, [userRecipes]);

  const getUserRecipe = useCallback((id: string) => {
    return userRecipes.find(recipe => recipe.idMeal === id);
  }, [userRecipes]);

  return (
    <UserRecipesContext.Provider value={{ userRecipes, addUserRecipe, updateUserRecipe, deleteUserRecipe, getUserRecipe }}>
      {children}
    </UserRecipesContext.Provider>
  );
};

export const useUserRecipes = () => {
  const context = useContext(UserRecipesContext);
  if (!context) throw new Error('useUserRecipes must be used within a UserRecipesProvider');
  return context;
};