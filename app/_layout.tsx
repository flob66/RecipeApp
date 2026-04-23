import { Tabs } from 'expo-router';
import { FavoritesProvider } from '../src/context/FavoritesContext';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

export default function RootLayout() {

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }}>
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
                headerShown: false,
                headerTitleStyle: { fontWeight: '700', fontSize: 20, color: '#fff' },
                headerTintColor: '#fff',
                tabBarActiveTintColor: '#764ba2',
                tabBarInactiveTintColor: '#999',
                tabBarStyle: {
                  backgroundColor: '#fff',
                  borderTopWidth: 0,
                  elevation: 0,
                  shadowOpacity: 0,
                  shadowOffset: { width: 0, height: 0 },
                  shadowRadius: 0,
                  height: 70,
                  paddingBottom: 8,
                  paddingTop: 8,
                },
                tabBarLabelStyle: { fontSize: 12, fontWeight: '500', marginBottom: 4 },
              }}
            >
              <Tabs.Screen
                name="index"
                options={{
                  title: 'Accueil',
                  tabBarIcon: ({ color, size }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: size + 10, height: size + 10 }}>
                      <Text style={{ fontSize: size, color }}>🏠</Text>
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="recipes"
                options={{
                  title: 'Recettes',
                  tabBarIcon: ({ color, size }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: size + 10, height: size + 10 }}>
                      <Text style={{ fontSize: size, color }}>🍲</Text>
                    </View>
                  ),
                }}
              />
              <Tabs.Screen
                name="favorites"
                options={{
                  title: 'Favoris',
                  tabBarIcon: ({ color, size }) => (
                    <View style={{ justifyContent: 'center', alignItems: 'center', width: size + 10, height: size + 10 }}>
                      <Text style={{ fontSize: size, color }}>❤️</Text>
                    </View>
                  ),
                }}
              />
            </Tabs>
          </FavoritesProvider>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}