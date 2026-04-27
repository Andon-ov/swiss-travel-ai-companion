import { onRequest } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";
import Stripe from "stripe";

const db = getFirestore();

export const stripeWebhook = onRequest(
  { secrets: ["STRIPE_SECRET_KEY", "STRIPE_WEBHOOK_SECRET"], cors: false },
  async (req, res) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: "2026-04-22.dahlia" as any,
    });
    
    const sig = req.headers["stripe-signature"] as string;
    let event: any;

    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err: any) {
      console.error("Webhook Signature Error:", err.message);
      res.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object;
      const { userId } = paymentIntent.metadata;

      if (userId) {
        console.log(`Payment succeeded for user: ${userId}`);
        
        // 1. Unlock premium for user
        await db.doc(`users/${userId}`).set({
          isPremium: true,
          unlockedAt: Date.now(),
        }, { merge: true });

        // 2. Record payment
        await db.collection("payments").add({
          userId,
          amount: paymentIntent.amount,
          currency: paymentIntent.currency,
          paymentIntentId: paymentIntent.id,
          status: "succeeded",
          createdAt: Date.now(),
        });
      }
    }

    res.json({ received: true });
  }
);
