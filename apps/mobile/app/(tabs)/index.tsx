import { StyleSheet, Text, View } from 'react-native';
import { SPOTS } from '../../constants/spots';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Brienz Guide Map</Text>
      <Text style={styles.subtitle}>{SPOTS.length} spots discovered in Brienz</Text>
      <View style={styles.mapPlaceholder}>
        <Text>Map View will be here</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
