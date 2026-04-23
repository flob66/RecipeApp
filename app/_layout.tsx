import { Tabs } from 'expo-router';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Application from 'expo-application';
import { useEffect, useState } from 'react';

export default function RootLayout() {
  const [appName, setAppName] = useState<string>('RecipeApp');

  useEffect(() => {
    const name = Application.applicationName;
    if (name) setAppName(name);
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <Tabs
          screenOptions={{
            headerBackground: () => (
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={{ flex: 1 }}
              />
            ),
            headerTitle: appName,
            headerTitleStyle: { fontWeight: '700', fontSize: 20, color: '#fff' },
            headerTintColor: '#fff',
            tabBarActiveTintColor: '#764ba2',
            tabBarInactiveTintColor: '#999',
            tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 0, elevation: 8, shadowOpacity: 0.1, height: 55 },
            tabBarLabelStyle: { fontSize: 12, fontWeight: '500' },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Accueil',
              tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🏠</Text>,
            }}
          />
          <Tabs.Screen
            name="recipes"
            options={{
              title: 'Recettes',
              tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>🍲</Text>,
            }}
          />
          <Tabs.Screen
            name="favorites"
            options={{
              title: 'Favoris',
              tabBarIcon: ({ color, size }) => <Text style={{ fontSize: size, color }}>❤️</Text>,
            }}
          />
        </Tabs>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}