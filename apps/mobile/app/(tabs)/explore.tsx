import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { SPOTS, Spot } from '../../constants/spots';
import { ChevronRight, MapPin } from 'lucide-react-native';
import { useLocation } from '../../hooks/useLocation';

// Haversine formula duplicated here for simplicity or we could export it
function getDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) + Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ExploreScreen() {
  const router = useRouter();
  const { location } = useLocation();

  const spotsWithDistance = SPOTS.map(spot => {
    if (!location) return { ...spot, distance: null };
    return {
      ...spot,
      distance: getDistance(
        location.coords.latitude,
        location.coords.longitude,
        spot.lat,
        spot.lng
      )
    };
  }).sort((a, b) => {
    if (a.distance === null) return 1;
    if (b.distance === null) return -1;
    return a.distance - b.distance;
  });

  const formatDistance = (meters: number | null) => {
    if (meters === null) return '';
    if (meters < 1000) return `${Math.round(meters)}m`;
    return `${(meters / 1000).toFixed(1)}km`;
  };

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity 
      style={styles.card}
      onPress={() => router.push(`/spot/${item.id}`)}
    >
      <View style={styles.cardContent}>
        <View style={{ flex: 1 }}>
          <Text style={styles.spotName}>{item.name}</Text>
          <View style={styles.infoRow}>
            <Text style={styles.spotCategory}>{item.category || 'Sightseeing'}</Text>
            {item.distance !== null && (
              <View style={styles.distanceBadge}>
                <MapPin size={12} color="#666" />
                <Text style={styles.distanceText}>{formatDistance(item.distance)}</Text>
              </View>
            )}
          </View>
        </View>
        <ChevronRight size={20} color="#ccc" />
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={spotsWithDistance}
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
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  spotCategory: {
    fontSize: 14,
    color: '#666',
    textTransform: 'capitalize',
  },
  distanceBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#eee',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    marginLeft: 10,
  },
  distanceText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 2,
  },
});
