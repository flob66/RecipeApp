import { Stack, router } from 'expo-router';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { TouchableOpacity, Text } from 'react-native';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FavoritesProvider>
        <Stack>
          <Stack.Screen 
            name="index" 
            options={{ 
              title: 'Recettes',
              headerRight: () => (
                <TouchableOpacity onPress={() => router.push('/favorites')}>
                  <Text style={{ fontSize: 16, color: '#007AFF', marginRight: 16 }}>Favoris</Text>
                </TouchableOpacity>
              )
            }} 
          />
          <Stack.Screen name="recipes/[id]" options={{ title: 'Détail' }} />
          <Stack.Screen name="favorites/index" options={{ title: 'Favoris' }} />
        </Stack>
      </FavoritesProvider>
    </GestureHandlerRootView>
  );
}