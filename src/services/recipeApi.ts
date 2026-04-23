import { Recipe, RecipeSummary, SearchResponse } from '../types/recipe';

const BASE_URL = 'https://www.themealdb.com/api/json/v1/1';

export const recipeApi = {
  searchByName: async (query: string): Promise<Recipe[]> => {
    if (!query.trim()) return [];
    const response = await fetch(`${BASE_URL}/search.php?s=${encodeURIComponent(query)}`);
    const data: SearchResponse = await response.json();
    return data.meals || [];
  },

  getRecipesByCategory: async (category: string = 'Dessert'): Promise<RecipeSummary[]> => {
    const response = await fetch(`${BASE_URL}/filter.php?c=${encodeURIComponent(category)}`);
    const data = await response.json();
    return data.meals || [];
  },

  getRecipeById: async (id: string): Promise<Recipe | null> => {
    const response = await fetch(`${BASE_URL}/lookup.php?i=${id}`);
    const data = await response.json();
    return data.meals ? data.meals[0] : null;
  },
};