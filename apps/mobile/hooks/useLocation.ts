import * as Location from 'expo-location';
import { useState, useEffect } from 'react';

export function useLocation() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getLocation() {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          setLoading(false);
          return;
        }

        let loc = await Location.getCurrentPositionAsync({});
        setLocation(loc);
      } catch (error) {
        setErrorMsg('Error getting location');
      } finally {
        setLoading(false);
      }
    }

    getLocation();
  }, []);

  return { location, errorMsg, loading };
}
