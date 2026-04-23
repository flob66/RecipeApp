export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  [key: string]: string | undefined;
}

export interface RecipeSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
}

export interface SearchResponse {
  meals: Recipe[] | null;
}