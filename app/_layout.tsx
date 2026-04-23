import { Tabs } from 'expo-router';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <Tabs
          screenOptions={{
            headerTitle: 'RecipeApp',
            headerStyle: { backgroundColor: '#f4511e' },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: 'bold' },
            tabBarActiveTintColor: '#f4511e',
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
