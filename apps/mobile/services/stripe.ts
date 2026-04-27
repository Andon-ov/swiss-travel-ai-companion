import { initStripe } from '@stripe/stripe-react-native';
import { httpsCallable } from 'firebase/functions';
import { functions } from './firebase';

// Initialize Stripe once
export const setupStripe = () => {
  const publishableKey = process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY;
  if (publishableKey) {
    initStripe({
      publishableKey,
      merchantIdentifier: 'merchant.com.brienzguide', // required for Apple Pay
    });
  }
};

export async function fetchPaymentSheetParams(userId: string) {
  const createPayment = httpsCallable(functions, 'createPayment');
  const result = await createPayment({ userId });
  const { clientSecret } = result.data as { clientSecret: string };

  return {
    paymentIntent: clientSecret,
  };
}
