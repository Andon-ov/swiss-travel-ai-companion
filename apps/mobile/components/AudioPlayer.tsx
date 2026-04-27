import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';
import * as Speech from 'expo-speech';
import { Play, Square, Volume2 } from 'lucide-react-native';

interface AudioPlayerProps {
  text: string;
  language: string;
}

export function AudioPlayer({ text, language }: AudioPlayerProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);

  const speak = async () => {
    if (isSpeaking) {
      await Speech.stop();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);
    Speech.speak(text, {
      language: language === 'bg' ? 'bg-BG' : 'en-US',
      onDone: () => setIsSpeaking(false),
      onError: () => setIsSpeaking(false),
    });
  };

  if (!text) return null;

  return (
    <TouchableOpacity 
      style={[styles.container, isSpeaking && styles.playing]} 
      onPress={speak}
    >
      <View style={styles.iconContainer}>
        {isSpeaking ? (
          <Square size={20} color="white" fill="white" />
        ) : (
          <Play size={20} color="white" fill="white" />
        )}
      </View>
      <Text style={styles.text}>
        {isSpeaking ? 'Listening...' : 'Listen to AI Guide'}
      </Text>
      <Volume2 size={18} color={isSpeaking ? "white" : "#007AFF"} style={{ marginLeft: 'auto' }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f7ff',
    padding: 12,
    borderRadius: 12,
    marginTop: 15,
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  playing: {
    backgroundColor: '#007AFF',
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  playingText: {
    color: 'white',
  }
});
