import { View, Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Détail de la recette {id}</Text>
    </View>
  );
}