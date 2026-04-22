import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Recettes' }} />
      <Stack.Screen name="recipes/[id]" options={{ title: 'Détail' }} />
      <Stack.Screen name="favorites/index" options={{ title: 'Favoris' }} />
    </Stack>
  );
}