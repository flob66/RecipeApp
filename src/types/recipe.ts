export interface Recipe {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  isUserCreated?: boolean;
  localImageUri?: string;
}

export interface RecipeSummary {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  isUserCreated?: boolean;
}

export interface SearchResponse {
  meals: Recipe[] | null;
}