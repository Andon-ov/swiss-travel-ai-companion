import { useState, useEffect } from 'react';
import { httpsCallable } from 'firebase/functions';
import { functions } from '../services/firebase';

interface GuideResult {
  text: string;
  cached: boolean;
}

export function useSpotGuide(spotId: string, lang = 'en') {
  const [guide, setGuide] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!spotId) return;

    async function fetchGuide() {
      setLoading(true);
      setError(null);
      try {
        const getSpotGuide = httpsCallable<{ spotId: string, lang: string }, GuideResult>(
          functions, 
          'getSpotGuide'
        );
        const result = await getSpotGuide({ spotId, lang });
        setGuide(result.data.text);
      } catch (err: any) {
        console.error("Guide Fetch Error:", err);
        setError(err.message || "Failed to load the guide.");
      } finally {
        setLoading(false);
      }
    }

    fetchGuide();
  }, [spotId, lang]);

  return { guide, loading, error };
}
