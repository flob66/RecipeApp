import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur RecipeApp</Text>
      <View style={styles.cardsContainer}>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/recipes')}>
          <Text style={styles.cardEmoji}>🍲</Text>
          <Text style={styles.cardTitle}>Recettes</Text>
          <Text style={styles.cardDesc}>Découvrez des milliers de recettes</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => router.push('/favorites')}>
          <Text style={styles.cardEmoji}>❤️</Text>
          <Text style={styles.cardTitle}>Favoris</Text>
          <Text style={styles.cardDesc}>Vos recettes préférées</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 40, color: '#333' },
  cardsContainer: { flexDirection: 'row', justifyContent: 'space-around', width: '100%' },
  card: { backgroundColor: '#fff', borderRadius: 16, padding: 20, alignItems: 'center', width: '45%', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, elevation: 5 },
  cardEmoji: { fontSize: 48, marginBottom: 12 },
  cardTitle: { fontSize: 20, fontWeight: '600', marginBottom: 8 },
  cardDesc: { fontSize: 12, color: '#666', textAlign: 'center' },
});