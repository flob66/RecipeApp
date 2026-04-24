import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const [appName, setAppName] = useState<string>('RecipeApp');

  useEffect(() => {
    const name = Application.applicationName;
    if (name) setAppName(name);
  }, []);

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      <Animated.View entering={FadeInUp.delay(200).springify()} style={styles.header}>
        <Text style={styles.emoji}>🍳</Text>
        <Text style={styles.title}>Bienvenue sur</Text>
        <Text style={styles.subtitle}>{appName}</Text>
        <Text style={styles.tagline}>Découvrez des recettes délicieuses du monde entier</Text>
      </Animated.View>

      <View style={styles.cardsContainer}>
        <Animated.View entering={FadeInDown.delay(400).springify()} style={styles.cardWrapper}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/recipes')}>
            <LinearGradient
              colors={['#ff9a9e', '#fecfef']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Text style={styles.cardEmoji}>🍲</Text>
              <Text style={styles.cardTitle}>Explorer</Text>
              <Text style={styles.cardDesc}>Parcourez des milliers de recettes</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(600).springify()} style={styles.cardWrapper}>
          <TouchableOpacity style={styles.card} onPress={() => router.push('/favorites')}>
            <LinearGradient
              colors={['#a18cd1', '#fbc2eb']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.cardGradient}
            >
              <Text style={styles.cardEmoji}>❤️</Text>
              <Text style={styles.cardTitle}>Favoris</Text>
              <Text style={styles.cardDesc}>Vos recettes préférées</Text>
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1 
  },
  header: {
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
    paddingHorizontal: 20,
  },
  emoji: { 
    fontSize: 64, 
    marginBottom: 16 
  },
  title: { 
    fontSize: 28, 
    fontWeight: '400', 
    color: '#fff', 
    opacity: 0.9 
  },
  subtitle: { 
    fontSize: 42, 
    fontWeight: '800', 
    color: '#fff', 
    marginTop: 8 
  },
  tagline: { 
    fontSize: 16, 
    color: '#fff', 
    opacity: 0.8, 
    marginTop: 12, 
    textAlign: 'center' 
  },
  cardsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    marginTop: 20,
    width: '100%',
  },
  cardWrapper: {
    width: width * 0.4,
    aspectRatio: 1,
  },
  card: {
    flex: 1,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  cardGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  cardEmoji: { 
    fontSize: 48, 
    marginBottom: 12 
  },
  cardTitle: { 
    fontSize: 24, 
    fontWeight: '700', 
    color: '#fff', 
    marginBottom: 8 
  },
  cardDesc: { 
    fontSize: 12, 
    color: '#fff', 
    opacity: 0.9, 
    textAlign: 'center'
  },
});