import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SPOTS, Spot } from '../../constants/spots';
import { ChevronRight } from 'lucide-react-native';

export default function ExploreScreen() {
  const router = useRouter();

  const renderItem = ({ item }: { item: Spot }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/spot/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View>
          <Text style={styles.spotName}>{item.name}</Text>
          <Text style={styles.spotCategory}>{item.category || 'Sightseeing'}</Text>
        </View>
        <ChevronRight size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={SPOTS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  spotName: {
    fontSize: 18,
    fontWeight: '600',
  },
  spotCategory: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
    textTransform: 'capitalize',
  },
});
