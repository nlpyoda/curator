import '@testing-library/jest-native/extend-expect';
import { Animated as RNAnimated } from 'react-native';

// Mock the Animated API
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Mock Dimensions
jest.mock('react-native/Libraries/Utilities/Dimensions', () => ({
  get: jest.fn().mockReturnValue({ width: 375, height: 812 }),
  addEventListener: jest.fn(),
  removeEventListener: jest.fn(),
}));

// Mock Platform
jest.mock('react-native/Libraries/Utilities/Platform', () => ({
  OS: 'ios',
  select: jest.fn(obj => obj.ios),
}));

// Mock StatusBar
jest.mock('expo-status-bar', () => ({
  StatusBar: 'StatusBar',
}));

// Mock react-native-reanimated
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  const View = require('react-native/Libraries/Components/View/View');
  return {
    GestureHandlerRootView: View,
    Gesture: {
      Pan: () => ({
        onUpdate: () => ({}),
        onEnd: () => ({}),
      }),
      Tap: () => ({
        onStart: () => ({}),
        onFinalize: () => ({}),
      }),
      Simultaneous: () => ({}),
    },
    GestureDetector: View,
  };
});

// Mock the Animated API from react-native
jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.Animated.loop = (animation) => ({ start: () => {}, stop: () => {} });
  RN.Animated.sequence = (animations) => ({ start: () => {}, stop: () => {} });
  RN.Animated.timing = (value, config) => ({ start: () => {}, stop: () => {} });
  return RN;
});

// Mock react-native Animated API methods used in EtherealBackground
RNAnimated.loop = (animation) => ({ start: () => {}, stop: () => {} });
RNAnimated.sequence = (animations) => ({ start: () => {}, stop: () => {} });
RNAnimated.timing = (value, config) => ({ start: () => {}, stop: () => {} }); 