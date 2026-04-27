import { useLocalSearchParams, Stack } from 'expo-router';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { SPOTS } from '../../constants/spots';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const spot = SPOTS.find(s => s.id === id);

  if (!spot) {
    return (
      <View style={styles.container}>
        <Text>Spot not found</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Stack.Screen options={{ title: spot.name }} />
      <View style={styles.header}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.category}>{spot.category || 'Sightseeing'}</Text>
      </View>
      
      <View style={styles.content}>
        <Text style={styles.description}>
          {spot.shortDesc || 'No description available for this spot yet.'}
        </Text>
        
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>AI Guide</Text>
          <Text style={styles.infoText}>
            AI-generated guide content will appear here in Phase 3.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    backgroundColor: '#f0f7ff',
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
  },
  category: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 4,
    textTransform: 'capitalize',
  },
  content: {
    padding: 20,
  },
  description: {
    fontSize: 17,
    lineHeight: 24,
    color: '#333',
  },
  infoBox: {
    marginTop: 30,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#eee',
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#666',
    fontStyle: 'italic',
  },
});
