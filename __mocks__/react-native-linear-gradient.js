import React from 'react';
import { View } from 'react-native';

const LinearGradient = ({ children, style, ...props }) => {
  return (
    <View style={[style, { background: 'linear-gradient(to right, #000000, #ffffff)' }]} {...props}>
      {children}
    </View>
  );
};

export default LinearGradient; 