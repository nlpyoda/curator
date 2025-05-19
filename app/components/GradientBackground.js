import React from 'react';
import { Platform, View } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const GradientBackground = ({ colors, style, children }) => {
  if (Platform.OS === 'web') {
    // Web-specific gradient implementation using CSS
    const gradientStyle = {
      ...style,
      background: `linear-gradient(180deg, ${colors[0]} 0%, ${colors[1]} 100%)`,
      width: '100%',
      height: '100%',
      position: 'relative',
    };

    return (
      <View style={gradientStyle}>
        {children}
      </View>
    );
  }

  // Native implementation
  return (
    <LinearGradient
      colors={colors}
      style={style}
    >
      {children}
    </LinearGradient>
  );
};

export default GradientBackground; 