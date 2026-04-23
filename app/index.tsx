import React, { useCallback, useRef } from 'react';
import { View, Text, FlatList, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import { useRecipes } from '../src/hooks/useRecipes';
import { router } from 'expo-router';
import { RecipeSummary } from '../src/types/recipe';
import Animated, { FadeIn, Layout } from 'react-native-reanimated';

const AnimatedTouchable = Animated.createAnimatedComponent(TouchableOpacity);

export default function HomeScreen() {
  const { recipes, loading, hasMore, loadMore, searchQuery, searchRecipes } = useRecipes('Dessert');
  const flatListRef = useRef<FlatList>(null);

  const renderItem = useCallback(({ item, index }: { item: RecipeSummary; index: number }) => (
    <AnimatedTouchable
      entering={FadeIn.delay(index * 50)}
      layout={Layout.springify()}
      style={styles.card}
      onPress={() => router.push(`/recipes/${item.idMeal}`)}
    >
      <Text style={styles.recipeTitle}>{item.strMeal}</Text>
    </AnimatedTouchable>
  ), []);

  const renderFooter = () => loading ? <ActivityIndicator style={styles.footer} size="large" /> : null;

  const handleEndReached = () => { if (hasMore && !loading) loadMore(); };

  return (
    <View style={styles.container}>
      <TextInput style={styles.searchInput} placeholder="Rechercher une recette..." value={searchQuery} onChangeText={searchRecipes} />
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
        style={{ flex: 1 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#f5f5f5' 
  },
  searchInput: { 
    height: 48, 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    marginBottom: 12, 
    backgroundColor: '#fff' 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    marginVertical: 6, 
    borderRadius: 8, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 4, 
    elevation: 2 
  },
  recipeTitle: { 
    fontSize: 16, 
    fontWeight: '500' 
  },
  footer: { 
    marginVertical: 16 
  },
});