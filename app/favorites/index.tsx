import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFavorites } from '../../src/context/FavoritesContext';
import { router } from 'expo-router';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/ReanimatedSwipeable';
import Animated, { Layout, FadeInLeft } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();

  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteButton} onPress={() => removeFavorite(id)}>
      <Text style={styles.deleteText}>Supprimer</Text>
    </RectButton>
  );

  // useCallback évite de recréer la fonction renderItem à chaque rendu, optimisant la FlatList.
  const renderItem = useCallback(({ item, index }: { item: any; index: number }) => (
    // L'animation d'entrée FadeInLeft avec délai progressif rend chaque carte plus agréable.
    <Animated.View entering={FadeInLeft.delay(index * 100).springify()}>
      {/* Swipeable: permet de glisser sur l'élément pour révéler l'action de suppression. */}
      <Swipeable renderRightActions={() => renderRightActions(item.idMeal)}>
        <TouchableOpacity style={styles.card} onPress={() => router.push(`/recipes/${item.idMeal}`)}>
          <LinearGradient
            colors={['#ffffff', '#fff5f5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cardGradient}
          >
            <Text style={styles.recipeEmoji}>❤️</Text>
            <View style={styles.cardContent}>
              <Text style={styles.recipeTitle}>{item.strMeal}</Text>
              <Text style={styles.recipeSubtitle}>Glissez pour supprimer ←</Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </Swipeable>
    </Animated.View>
  ), []);

  if (favorites.length === 0) {
    return (
      <LinearGradient colors={['#f5f0ff', '#ffffff']} style={styles.emptyContainer}>
        <Text style={styles.emptyEmoji}>💔</Text>
        <Text style={styles.emptyText}>Aucune recette favorite</Text>
        <Text style={styles.emptySubtext}>Ajoutez vos recettes préférées depuis l'onglet Recettes</Text>
      </LinearGradient>
    );
  }

  return (
    <LinearGradient colors={['#f5f0ff', '#ffffff']} style={styles.container}>
      <AnimatedFlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  listContent: { 
    padding: 16 
  },
  card: { 
    marginBottom: 12, 
    borderRadius: 16, 
    overflow: 'hidden' 
  },
  cardGradient: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16 
  },
  recipeEmoji: { 
    fontSize: 32, 
    marginRight: 16 
  },
  cardContent: { 
    flex: 1 
  },
  recipeTitle: { 
    fontSize: 16, 
    fontWeight: '600', 
    color: '#333' 
  },
  recipeSubtitle: { 
    fontSize: 12, 
    color: '#ff6b6b', 
    marginTop: 4 
  },
  deleteButton: { 
    backgroundColor: '#ff4757', 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: 80, 
    borderRadius: 12, 
    marginBottom: 12 
  },
  deleteText: { 
    color: '#fff', 
    fontWeight: 'bold' 
  },
  emptyContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: 20 
  },
  emptyEmoji: { 
    fontSize: 64, 
    marginBottom: 16 
  },
  emptyText: { 
    fontSize: 18, 
    fontWeight: '600', 
    color: '#764ba2', 
    marginBottom: 8 
  },
  emptySubtext: { 
    fontSize: 14, 
    color: '#999', 
    textAlign: 'center' 
  },
});