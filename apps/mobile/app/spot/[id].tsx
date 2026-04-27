import React, { useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { StyleSheet, Text, View, ScrollView, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import { SPOTS } from '../../constants/spots';
import { useSpotGuide } from '../../hooks/useSpotGuide';
import { usePremium } from '../../hooks/usePremium';
import { AudioPlayer } from '../../components/AudioPlayer';
import { PaywallModal } from '../../components/PaywallModal';
import { Lock } from 'lucide-react-native';

export default function SpotDetailScreen() {
  const { id } = useLocalSearchParams();
  const spot = SPOTS.find(s => s.id === id);
  const { isPremium, loading: authLoading, userId } = usePremium();
  const { guide, loading: guideLoading, error } = useSpotGuide(id as string);
  const [showPaywall, setShowPaywall] = useState(false);

  if (!spot) {
    return (
      <View style={styles.container}>
        <Text>Spot not found</Text>
      </View>
    );
  }

  const isLocked = !spot.isFree && !isPremium;

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
          <View style={styles.infoTitleRow}>
            <Text style={styles.infoTitle}>AI Guide</Text>
            {isLocked && <Lock size={20} color="#FF9500" />}
          </View>
          
          {authLoading || (guideLoading && !isLocked) ? (
            <ActivityIndicator size="small" color="#007AFF" style={{ marginVertical: 20 }} />
          ) : isLocked ? (
            <View style={styles.lockedContainer}>
              <Text style={styles.lockedText}>
                This content is exclusive to Premium users. 
                Unlock the full Brienz guide to read and listen to the AI-powered history of this place.
              </Text>
              <TouchableOpacity 
                style={styles.unlockButton}
                onPress={() => setShowPaywall(true)}
              >
                <Text style={styles.unlockButtonText}>Unlock Now</Text>
              </TouchableOpacity>
            </View>
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

      <Modal
        visible={showPaywall}
        animationType="slide"
        onRequestClose={() => setShowPaywall(false)}
      >
        <PaywallModal 
          userId={userId || ''} 
          onClose={() => setShowPaywall(false)} 
        />
      </Modal>
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
    minHeight: 150,
  },
  infoTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  infoText: {
    fontSize: 16,
    lineHeight: 24,
    color: '#444',
  },
  lockedContainer: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  lockedText: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    fontStyle: 'italic',
    lineHeight: 22,
    marginBottom: 20,
  },
  unlockButton: {
    backgroundColor: '#FF9500',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 20,
  },
  unlockButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  errorText: {
    color: '#D32F2F',
    fontStyle: 'italic',
  }
});
