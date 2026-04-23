import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet } from 'react-native';
import React, { ReactNode } from 'react';

interface GradientBackgroundProps {
  children: ReactNode;
  colors?: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
}

export default function GradientBackground({
  children,
  colors = ['#667eea', '#764ba2', '#f093fb'], 
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
}: GradientBackgroundProps) {
  return (
    <LinearGradient colors={colors} start={start} end={end} style={styles.gradient}>
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});