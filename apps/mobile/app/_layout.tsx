import { Stack } from 'expo-router';
import { StripeProvider } from '@stripe/stripe-react-native';
import { useEffect } from 'react';
import { setupStripe } from '../services/stripe';

export default function RootLayout() {
  useEffect(() => {
    setupStripe();
  }, []);

  return (
    <StripeProvider
      publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || ''}
      merchantIdentifier="merchant.com.brienzguide"
    >
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="spot/[id]" options={{ title: 'Spot Details' }} />
      </Stack>
    </StripeProvider>
  );
}
