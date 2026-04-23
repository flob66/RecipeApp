import React, { useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useFavorites } from '../../src/context/FavoritesContext';
import { router } from 'expo-router';
import { RectButton } from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Animated, { Layout } from 'react-native-reanimated';

const AnimatedFlatList = Animated.createAnimatedComponent(FlatList);

export default function FavoritesScreen() {
  const { favorites, removeFavorite } = useFavorites();

  const renderRightActions = (id: string) => (
    <RectButton style={styles.deleteButton} onPress={() => removeFavorite(id)}>
      <Text style={styles.deleteText}>Supprimer</Text>
    </RectButton>
  );

  const renderItem = useCallback(({ item }: { item: any }) => (
    <Swipeable renderRightActions={() => renderRightActions(item.idMeal)}>
      <TouchableOpacity style={styles.card} onPress={() => router.push(`/recipes/${item.idMeal}`)}>
        <Text style={styles.recipeTitle}>{item.strMeal}</Text>
      </TouchableOpacity>
    </Swipeable>
  ), []);

  if (favorites.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune recette favorite</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <AnimatedFlatList
        data={favorites}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f5f5f5' },
  card: { backgroundColor: '#fff', padding: 16, marginVertical: 6, borderRadius: 8 },
  recipeTitle: { fontSize: 16 },
  deleteButton: { backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', width: 80, borderRadius: 8, marginVertical: 6 },
  deleteText: { color: 'white', fontWeight: 'bold' },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontSize: 18, color: '#888' },
});