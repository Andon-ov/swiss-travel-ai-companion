import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useStripe } from '@stripe/stripe-react-native';
import { fetchPaymentSheetParams } from '../services/stripe';
import { Sparkles, CheckCircle2, X } from 'lucide-react-native';

interface PaywallModalProps {
  userId: string;
  onClose: () => void;
}

export function PaywallModal({ userId, onClose }: PaywallModalProps) {
  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [loading, setLoading] = useState(false);

  const buyPremium = async () => {
    setLoading(true);
    try {
      // 1. Get Payment Intent
      const { paymentIntent } = await fetchPaymentSheetParams(userId);

      // 2. Initialize Payment Sheet
      const { error: initError } = await initPaymentSheet({
        merchantDisplayName: 'Brienz AI Guide',
        paymentIntentClientSecret: paymentIntent,
        defaultBillingDetails: {
          name: 'Tourist',
        },
      });

      if (initError) {
        Alert.alert('Error', initError.message);
        return;
      }

      // 3. Present Payment Sheet
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        if (presentError.code !== 'Canceled') {
          Alert.alert('Payment Failed', presentError.message);
        }
      } else {
        Alert.alert('Success', 'Welcome to Premium! All spots are now unlocked.');
        onClose();
      }
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.closeButton} onPress={onClose}>
        <X size={24} color="#666" />
      </TouchableOpacity>

      <View style={styles.header}>
        <Sparkles size={60} color="#007AFF" />
        <Text style={styles.title}>Unlock Full Guide</Text>
        <Text style={styles.subtitle}>Get instant access to all 10+ locations and AI-powered stories.</Text>
      </View>

      <View style={styles.features}>
        <View style={styles.featureRow}>
          <CheckCircle2 size={20} color="#4CAF50" />
          <Text style={styles.featureText}>10+ Detailed Locations</Text>
        </View>
        <View style={styles.featureRow}>
          <CheckCircle2 size={20} color="#4CAF50" />
          <Text style={styles.featureText}>AI-Powered Historical Insights</Text>
        </View>
        <View style={styles.featureRow}>
          <CheckCircle2 size={20} color="#4CAF50" />
          <Text style={styles.featureText}>Full Audio Guide Support</Text>
        </View>
      </View>

      <TouchableOpacity 
        style={styles.button} 
        onPress={buyPremium}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.buttonText}>Unlock Everything for 1.99€</Text>
        )}
      </TouchableOpacity>
      
      <Text style={styles.footer}>One-time payment. Lifetime access to Brienz Guide.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  closeButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    padding: 10,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 22,
  },
  features: {
    marginBottom: 40,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  featureText: {
    fontSize: 16,
    marginLeft: 10,
    color: '#333',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 18,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 20,
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
  }
});
