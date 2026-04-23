import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { recipeApi } from '../../src/services/recipeApi';
import { Recipe } from '../../src/types/recipe';
import { useFavorites } from '../../src/context/FavoritesContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import * as Haptics from 'expo-haptics';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  const favoriteScale = useSharedValue(1);

  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await recipeApi.getRecipeById(id as string);
      setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [id]);

  const handleFavorite = () => {
    if (!recipe) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    favoriteScale.value = withSpring(1.5, {}, () => { favoriteScale.value = withSpring(1); });
    if (isFavorite(recipe.idMeal)) removeFavorite(recipe.idMeal);
    else addFavorite({ idMeal: recipe.idMeal, strMeal: recipe.strMeal, strMealThumb: recipe.strMealThumb });
  };

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: favoriteScale.value }] }));

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" />;
  if (!recipe) return <Text style={{ textAlign: 'center', marginTop: 20 }}>Recette non trouvée</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{recipe.strMeal}</Text>
      <Text style={styles.category}>{recipe.strCategory} - {recipe.strArea}</Text>
      <TouchableOpacity onPress={handleFavorite} style={styles.favButton}>
        <Animated.Text style={[styles.favText, animatedStyle]}>
          {isFavorite(recipe.idMeal) ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        </Animated.Text>
      </TouchableOpacity>
      <Text style={styles.sectionTitle}>Instructions</Text>
      <Text style={styles.instructions}>{recipe.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  image: { width: '100%', height: 250, resizeMode: 'cover' },
  title: { fontSize: 24, fontWeight: 'bold', margin: 16, marginBottom: 8 },
  category: { fontSize: 16, color: '#666', marginHorizontal: 16, marginBottom: 16 },
  favButton: { marginHorizontal: 16, marginVertical: 8, backgroundColor: '#ffebee', padding: 12, borderRadius: 8, alignItems: 'center' },
  favText: { fontSize: 18 },
  sectionTitle: { fontSize: 20, fontWeight: '600', margin: 16, marginBottom: 8 },
  instructions: { fontSize: 16, lineHeight: 24, marginHorizontal: 16, marginBottom: 20 },
});