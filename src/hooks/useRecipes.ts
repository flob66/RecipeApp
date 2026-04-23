import { useState, useEffect, useCallback, useRef } from 'react';
import { recipeApi } from '../services/recipeApi';
import { RecipeSummary } from '../types/recipe';

export const useRecipes = (initialCategory: string = 'Dessert') => {
  const [recipes, setRecipes] = useState<RecipeSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const allRecipesRef = useRef<RecipeSummary[]>([]);
  const itemsPerPage = 10;

  const loadCategoryRecipes = useCallback(async (category: string) => {
    setLoading(true);
    const data = await recipeApi.getRecipesByCategory(category);
    allRecipesRef.current = data;
    setHasMore(data.length > itemsPerPage);
    setRecipes(data.slice(0, itemsPerPage));
    setPage(1);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadCategoryRecipes(initialCategory);
  }, [initialCategory, loadCategoryRecipes]);

  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    const nextPage = page + 1;
    const newRecipes = allRecipesRef.current.slice(0, nextPage * itemsPerPage);
    if (newRecipes.length === allRecipesRef.current.length) {
      setHasMore(false);
    }
    setRecipes(newRecipes);
    setPage(nextPage);
  }, [loading, hasMore, page]);

  const searchRecipes = useCallback((query: string) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setRecipes(allRecipesRef.current.slice(0, page * itemsPerPage));
    } else {
      const filtered = allRecipesRef.current.filter(recipe =>
        recipe.strMeal.toLowerCase().includes(query.toLowerCase())
      );
      setRecipes(filtered);
      setHasMore(false);
    }
  }, [page, itemsPerPage]);

  return { recipes, loading, hasMore, loadMore, searchQuery, searchRecipes };
};