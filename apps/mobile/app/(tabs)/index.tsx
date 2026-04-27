import React, { useState } from 'react';
import { StyleSheet, View, Text, ActivityIndicator, TouchableOpacity, Modal } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { useRouter } from 'expo-router';
import { SPOTS } from '../../constants/spots';
import { useLocation } from '../../hooks/useLocation';
import { QrCode } from 'lucide-react-native';
import { QRScanner } from '../../components/QRScanner';

export default function MapScreen() {
  const router = useRouter();
  const { location, loading, errorMsg } = useLocation();
  const [showScanner, setShowScanner] = useState(false);

  const BRIENZ_CENTER = {
    latitude: 46.745,
    longitude: 8.036,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={{ marginTop: 10 }}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={
          location
            ? {
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.01,
                longitudeDelta: 0.01,
              }
            : BRIENZ_CENTER
        }
        showsUserLocation
        showsMyLocationButton
      >
        {SPOTS.map((spot) => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.lat, longitude: spot.lng }}
            title={spot.name}
            pinColor={spot.isFree ? 'green' : 'red'}
          >
            <Callout onPress={() => router.push(`/spot/${spot.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutTitle}>{spot.name}</Text>
                <Text style={styles.calloutLink}>Tap to view guide</Text>
              </View>
            </Callout>
          </Marker>
        ))}
      </MapView>

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => setShowScanner(true)}
      >
        <QrCode size={30} color="white" />
        <Text style={styles.fabText}>Scan QR</Text>
      </TouchableOpacity>

      <Modal
        visible={showScanner}
        animationType="slide"
        onRequestClose={() => setShowScanner(false)}
      >
        <QRScanner onClose={() => setShowScanner(false)} />
      </Modal>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  callout: {
    width: 150,
    padding: 5,
  },
  calloutTitle: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  calloutLink: {
    color: '#007AFF',
    fontSize: 12,
    marginTop: 4,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 8,
  },
  fabText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 8,
  },
  errorContainer: {
    position: 'absolute',
    top: 50,
    left: 20,
    right: 20,
    backgroundColor: 'rgba(255, 0, 0, 0.7)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'white',
    textAlign: 'center',
  },
});
