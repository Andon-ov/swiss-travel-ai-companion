import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { usePremium } from '../../hooks/usePremium';
import { PaywallModal } from '../../components/PaywallModal';
import { User, ShieldCheck, Sparkles } from 'lucide-react-native';

export default function ProfileScreen() {
  const { isPremium, loading, userId } = usePremium();
  const [showPaywall, setShowPaywall] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatarContainer}>
          <User size={50} color="#666" />
        </View>
        <Text style={styles.title}>Your Settings</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Account Status</Text>
            {isPremium ? (
              <View style={styles.premiumBadge}>
                <ShieldCheck size={16} color="white" />
                <Text style={styles.premiumText}>Premium</Text>
              </View>
            ) : (
              <Text style={styles.value}>Free Tier</Text>
            )}
          </View>
          
          {!isPremium && !loading && (
            <>
              <Text style={styles.tip}>
                You currently have access to 2 free locations. 
                Upgrade to unlock all stories and features.
              </Text>
              <TouchableOpacity 
                style={styles.upgradeButton}
                onPress={() => setShowPaywall(true)}
              >
                <Sparkles size={20} color="white" />
                <Text style={styles.upgradeButtonText}>Go Premium - 1.99€</Text>
              </TouchableOpacity>
            </>
          )}

          {isPremium && (
            <Text style={styles.successMessage}>
              Thank you for supporting Brienz AI Guide! 
              You have full access to all locations.
            </Text>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    padding: 30,
    alignItems: 'center',
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    color: '#666',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  premiumBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#4CAF50',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  premiumText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 5,
  },
  tip: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  upgradeButton: {
    flexDirection: 'row',
    backgroundColor: '#007AFF',
    paddingVertical: 15,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  upgradeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 10,
  },
  successMessage: {
    color: '#4CAF50',
    textAlign: 'center',
    fontWeight: '600',
    marginTop: 10,
  }
});
