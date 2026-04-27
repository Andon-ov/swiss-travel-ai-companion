import { useLocalSearchParams, Stack } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import { SPOTS } from '../../constants/spots';
import { useSpotGuide } from '../../hooks/useSpotGuide';
import { AudioPlayer } from '../../components/AudioPlayer';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const spot = SPOTS.find(s => s.id === id);
  const { guide, loading, error } = useSpotGuide(id as string);

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
          
          {loading ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
          ) : error ? (
            <Text style={styles.errorText}>{error}</Text>
          ) : (
            <>
              <Text style={styles.infoText}>
                {guide || "AI is thinking about this place..."}
              </Text>
              {guide && <AudioPlayer text={guide} language="en" />}
            </>
          )}
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
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  errorText: {
    color: '#D32F2F',
    fontStyle: 'italic',
  }
});
