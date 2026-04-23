import { Stack } from 'expo-router';

export default function RecipesLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: 'Liste des recettes', headerShown: true }} />
      <Stack.Screen name="[id]" options={{ title: 'Détail de la recette', headerShown: true }} />
    </Stack>
  );
}