import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { recipeApi } from '../../src/services/recipeApi';
import { Recipe } from '../../src/types/recipe';
import { useFavorites } from '../../src/context/FavoritesContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';

const { width } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  // Récupère l'ID de la recette depuis l'URL dynamique (ex: /recipes/52772)
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  // Contexte global des favoris (Provider)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  // SharedValue de Reanimated : valeur qui peut être animée sans provoquer de rendu React
  const favoriteScale = useSharedValue(1);

  //Chargement de la recette depuis l'API TheMealDB
  useEffect(() => {
    const fetchRecipe = async () => {
      const data = await recipeApi.getRecipeById(id as string);
      setRecipe(data);
      setLoading(false);
    };
    fetchRecipe();
  }, [id]); // Se relance si l'ID change

  useEffect(() => {
    const getAppInfo = async () => {
      const version = Application.nativeApplicationVersion;
      setAppVersion(version);
    };
    getAppInfo();
  }, []);

  const handleFavorite = () => {
    if (!recipe) return;
    favoriteScale.value = withSpring(1.3, {}, () => { favoriteScale.value = withSpring(1); });
    if (isFavorite(recipe.idMeal)) removeFavorite(recipe.idMeal);
    else addFavorite({ idMeal: recipe.idMeal, strMeal: recipe.strMeal, strMealThumb: recipe.strMealThumb });
  };

  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: favoriteScale.value }] }));

  if (loading) return (
    <LinearGradient colors={['#f5f0ff', '#ffffff']} style={styles.loadingContainer}>
      <ActivityIndicator size="large" color="#764ba2" />
    </LinearGradient>
  );
  
  if (!recipe) return (
    <LinearGradient colors={['#f5f0ff', '#ffffff']} style={styles.loadingContainer}>
      <Text style={{ textAlign: 'center', marginTop: 20 }}>Recette non trouvée</Text>
    </LinearGradient>
  );

  return (
    <Animated.ScrollView 
      entering={FadeIn.duration(600)} 
      style={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: recipe.strMealThumb }} style={styles.image} />
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.7)']}
          style={styles.imageOverlay}
        >
          <Text style={styles.imageTitle}>{recipe.strMeal}</Text>
        </LinearGradient>
      </View>

      <View style={styles.content}>
        <View style={styles.metaContainer}>
          <View style={styles.metaBadge}>
            <Text style={styles.metaIcon}>🍽️</Text>
            <Text style={styles.metaText}>{recipe.strCategory || 'Plat'}</Text>
          </View>
          <View style={styles.metaBadge}>
            <Text style={styles.metaIcon}>🌍</Text>
            <Text style={styles.metaText}>{recipe.strArea || 'International'}</Text>
          </View>
        </View>

        <TouchableOpacity onPress={handleFavorite} style={styles.favButton}>
          <Animated.Text style={[styles.favText, animatedStyle]}>
            {isFavorite(recipe.idMeal) ? '❤️  Retirer des favoris' : '❤️  Ajouter aux favoris'}
          </Animated.Text>
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>📖 Instructions</Text>
        <Text style={styles.instructions}>{recipe.strInstructions}</Text>

        {recipe.strYoutube && (
          <Text style={styles.youtubeText}>🎬 Voir la vidéo sur YouTube : {recipe.strYoutube}</Text>
        )}

        {appVersion && (
          <Text style={styles.bonusText}>
            Application version {appVersion}
          </Text>
        )}
      </View>
    </Animated.ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  loadingContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  imageContainer: { 
    width: width, 
    height: 350, 
    position: 'relative' 
  },
  image: { 
    width: '100%', 
    height: '100%', 
    resizeMode: 'cover' 
  },
  imageOverlay: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    height: 100, 
    justifyContent: 'flex-end', 
    padding: 20 
  },
  imageTitle: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#fff' 
  },
  content: { 
    padding: 20 
  },
  metaContainer: { 
    flexDirection: 'row', 
    marginBottom: 20 
  },
  metaBadge: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#f0e6ff', 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderRadius: 20, 
    marginRight: 12 
  },
  metaIcon: { 
    fontSize: 14, 
    marginRight: 4 
  },
  metaText: { 
    fontSize: 14, 
    color: '#764ba2', 
    fontWeight: '500' 
  },
  favButton: { 
    backgroundColor: '#ffebee', 
    paddingVertical: 14, 
    borderRadius: 50, 
    alignItems: 'center', 
    marginBottom: 24 
  },
  favText: { 
    fontSize: 16, 
    fontWeight: '500', 
    color: '#764ba2' 
  },
  sectionTitle: { 
    fontSize: 22, 
    fontWeight: '700', 
    color: '#333', 
    marginBottom: 12 
  },
  instructions: { 
    fontSize: 16, 
    lineHeight: 24, 
    color: '#555', 
    marginBottom: 20 
  },
  youtubeText: { 
    fontSize: 14, 
    color: '#764ba2', 
    marginTop: 10, 
    marginBottom: 20, 
    textDecorationLine: 'underline' 
  },
  bonusText: { 
    fontSize: 12, 
    color: '#aaa', 
    textAlign: 'center', 
    marginTop: 20,
    marginBottom: 30 
  },
});