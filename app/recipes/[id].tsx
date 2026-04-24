import React, { useEffect, useState } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StyleSheet, Dimensions, Alert, Modal } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { recipeApi } from '../../src/services/recipeApi';
import { Recipe } from '../../src/types/recipe';
import { useFavorites } from '../../src/context/FavoritesContext';
import { useUserRecipes } from '../../src/context/UserRecipesContext';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, FadeIn } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';

const { width, height } = Dimensions.get('window');

export default function RecipeDetailScreen() {
  // Récupère l'ID de la recette depuis l'URL dynamique (ex: /recipes/52772)
  const { id } = useLocalSearchParams();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [appVersion, setAppVersion] = useState<string | null>(null);
  // Contexte global des favoris (Provider)
  const { isFavorite, addFavorite, removeFavorite } = useFavorites();
  // SharedValue de Reanimated : valeur qui peut être animée sans provoquer de rendu React
  const { getUserRecipe, deleteUserRecipe } = useUserRecipes();
  const favoriteScale = useSharedValue(1);
  const [imageError, setImageError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [fullscreenImageUri, setFullscreenImageUri] = useState<string | null>(null);

  //Chargement de la recette depuis l'API TheMealDB
  useEffect(() => {
    const fetchRecipe = async () => {
      const userRecipe = getUserRecipe(id as string);
      if (userRecipe) {
        setRecipe(userRecipe);
        setLoading(false);
      } else {
        const data = await recipeApi.getRecipeById(id as string);
        setRecipe(data);
        setLoading(false);
      }
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
    else addFavorite({ idMeal: recipe.idMeal, strMeal: recipe.strMeal, strMealThumb: recipe.strMealThumb, isUserCreated: recipe.isUserCreated });
  };

  const handleEdit = () => {
    router.push(`/recipes/edit?id=${recipe?.idMeal}`);
  };

  const handleDelete = () => {
    if (!recipe) return;
    Alert.alert(
      'Delete Recipe',
      'Are you sure you want to delete this recipe?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteUserRecipe(recipe.idMeal);
              if (isFavorite(recipe.idMeal)) removeFavorite(recipe.idMeal);
              Alert.alert('Success', 'Recipe deleted successfully');
              router.replace('/recipes');
            } catch (error) {
              Alert.alert('Error', 'Failed to delete recipe');
            }
          }
        }
      ]
    );
  };

  const openFullscreen = () => {
    const uri = recipe?.localImageUri && !imageError ? recipe.localImageUri : recipe?.strMealThumb;
    if (uri) {
      setFullscreenImageUri(uri);
      setModalVisible(true);
    }
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

  const imageSource = recipe.localImageUri && !imageError
    ? { uri: recipe.localImageUri }
    : { uri: recipe.strMealThumb };

  return (
    <>
      <Animated.ScrollView
        entering={FadeIn.duration(600)}
        style={styles.container}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity activeOpacity={0.9} onPress={openFullscreen}>
          <View style={styles.imageContainer}>
            <Image
              source={imageSource}
              style={styles.image}
              onError={() => setImageError(true)}
            />
            <LinearGradient
              colors={['transparent', 'rgba(0,0,0,0.7)']}
              style={styles.imageOverlay}
            >
              <Text style={styles.imageTitle}>{recipe.strMeal}</Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>

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

          {recipe.isUserCreated && (
            <View style={styles.userActions}>
              <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
                <Text style={styles.editButtonText}>✏️ Modifier</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDelete} style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️ Supprimer</Text>
              </TouchableOpacity>
            </View>
          )}

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

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.modalBackground}
          activeOpacity={1}
          onPress={() => setModalVisible(false)}
        >
          <View style={styles.modalContent}>
            <Image
              source={{ uri: fullscreenImageUri ?? imageSource.uri }}
              style={styles.fullscreenImage}
              resizeMode="contain"
            />
            <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
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
    marginBottom: 12
  },
  favText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#764ba2'
  },
  userActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#667eea',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  editButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteButton: {
    flex: 0.48,
    backgroundColor: '#ff6b6b',
    paddingVertical: 12,
    borderRadius: 50,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#fff',
    fontWeight: '600',
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
  // Styles pour la modale
  modalBackground: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: width,
    height: height,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: width,
    height: height,
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.6)',
    borderRadius: 30,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
});