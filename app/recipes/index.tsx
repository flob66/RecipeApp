import React, { useCallback, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRecipes } from '../../src/hooks/useRecipes';
import { router } from 'expo-router';
import { RecipeSummary } from '../../src/types/recipe';
import Animated, { FadeInRight, Layout } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function RecipesListScreen() {
  const { recipes, loading, hasMore, loadMore, searchQuery, searchRecipes } = useRecipes('Dessert');
  const flatListRef = useRef<FlatList>(null);

  const renderItem = useCallback(({ item, index }: { item: RecipeSummary; index: number }) => (
    <AnimatedTouchable
      entering={FadeInRight.delay(index * 80).springify()}
      layout={Layout.springify()}
      onPress={() => router.push(`/recipes/${item.idMeal}`)}
    >
      <LinearGradient
        colors={['#ffffff', '#f8f9ff']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.card}
      >
        <Text style={styles.recipeEmoji}>🍽️</Text>
        <View style={styles.cardContent}>
          <Text style={styles.recipeTitle}>{item.strMeal}</Text>
          <Text style={styles.recipeSubtitle}>Cliquez pour voir la recette</Text>
        </View>
      </LinearGradient>
    </AnimatedTouchable>
  ), []);

  const renderFooter = () => loading ? <ActivityIndicator style={styles.footer} size="large" color="#764ba2" /> : null;
  const handleEndReached = () => { if (hasMore && !loading) loadMore(); };

  return (
    <LinearGradient colors={['#f5f0ff', '#ffffff']} style={styles.container}>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher une recette..."
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={searchRecipes}
        />
      </View>
      <FlatList
        ref={flatListRef}
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        renderItem={renderItem}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.5}
        ListFooterComponent={renderFooter}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    margin: 16,
    paddingHorizontal: 12,
    borderRadius: 50,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  searchIcon: { 
    fontSize: 20, 
    marginRight: 8 
  },
  searchInput: { 
    flex: 1, 
    height: 48, 
    fontSize: 16, 
    color: '#333' 
  },
  listContent: { 
    paddingBottom: 20 
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 16,
    marginVertical: 8,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#764ba2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
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
    color: '#764ba2', 
    marginTop: 4 
  },
  footer: { marginVertical: 20 },
});