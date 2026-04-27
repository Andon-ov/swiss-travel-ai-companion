import { onCall, HttpsError } from "firebase-functions/v2/https";
import Stripe from "stripe";

export const createPayment = onCall({ secrets: ["STRIPE_SECRET_KEY"] }, async (request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: "2026-04-22.dahlia" as any, 
  });

  const { userId } = request.data;

  if (!userId) {
    throw new HttpsError("invalid-argument", "The function must be called with a userId.");
  }

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 199, // 1.99€ in cents
      currency: "eur",
      automatic_payment_methods: { enabled: true },
      metadata: { userId },
    });

    return {
      clientSecret: paymentIntent.client_secret,
    };
  } catch (error) {
    console.error("Stripe Error:", error);
    throw new HttpsError("internal", "Failed to create payment intent.");
  }
});
