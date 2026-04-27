import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db, auth } from '../services/firebase';
import { onAuthStateChanged, signInAnonymously } from 'firebase/auth';

export function usePremium() {
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    // 1. Ensure user is signed in (anonymously or otherwise)
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
      } else {
        // Sign in anonymously if no user
        try {
          const cred = await signInAnonymously(auth);
          setUserId(cred.user.uid);
        } catch (error) {
          console.error("Auth Error:", error);
          setLoading(false);
        }
      }
    });

    return unsubscribeAuth;
  }, []);

  useEffect(() => {
    if (!userId) return;

    // 2. Listen to user document for premium status
    const unsubscribeDoc = onSnapshot(
      doc(db, 'users', userId),
      (doc) => {
        setIsPremium(doc.data()?.isPremium ?? false);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore Error:", error);
        setLoading(false);
      }
    );

    return unsubscribeDoc;
  }, [userId]);

  return { isPremium, loading, userId };
}
