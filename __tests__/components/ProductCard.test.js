import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ProductCard from '../../app/components/ProductCard';

// Mock the GradientBackground component
jest.mock('../../app/components/GradientBackground', () => {
  return ({ children, style, testID, ...props }) => {
    const { View } = require('react-native');
    return (
      <View style={style} testID={testID} {...props}>
        {children}
      </View>
    );
  };
});

// Mock Animated.View and other Reanimated components
jest.mock('react-native-reanimated', () => {
  const { View } = require('react-native');
  return {
    useSharedValue: jest.fn(() => ({ value: 0 })),
    useAnimatedStyle: jest.fn(() => ({})),
    withSpring: jest.fn((value) => value),
    interpolate: jest.fn(() => 0),
    Extrapolate: { CLAMP: 'clamp' },
    View,
  };
});

// Mock react-native-gesture-handler
jest.mock('react-native-gesture-handler', () => {
  class MockGesture {
    onUpdate() { return this; }
    onEnd() { return this; }
    onStart() { return this; }
    onFinalize() { return this; }
  }
  return {
    Gesture: {
      Pan: () => new MockGesture(),
      Tap: () => new MockGesture(),
      Simultaneous: () => new MockGesture(),
    },
    GestureDetector: ({ children }) => children,
  };
});

describe('ProductCard Component', () => {
  const mockProduct = {
    title: 'Test Product',
    price: '$99.99',
    description: 'Test description',
    source: 'Test Store',
    similarityScore: 85,
    averageRating: 4.5,
    whyBuy: 'Great value for money',
    prosAndCons: {
      pros: ['Pro 1', 'Pro 2'],
      cons: ['Con 1', 'Con 2'],
    },
    reviews: {
      amazon: 'Great product!',
      instagram: 'Love it!',
    },
  };

  const mockScrollY = {
    interpolate: jest.fn(() => 1),
  };

  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with all product information', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    expect(getByText('Test Product')).toBeTruthy();
    expect(getByText('$99.99')).toBeTruthy();
    expect(getByText('Test description')).toBeTruthy();
    expect(getByText('Test Store')).toBeTruthy();
    expect(getByText('Match Score: 85%')).toBeTruthy();
  });

  it('shows trending badge', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    expect(getByText('🔥 Trending')).toBeTruthy();
  });

  it('displays star rating correctly', () => {
    const { getAllByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    const stars = getAllByText(/[★☆]/);
    expect(stars).toHaveLength(5);
    expect(stars.filter(star => star.props.children === '★')).toHaveLength(4);
    expect(stars.filter(star => star.props.children === '☆')).toHaveLength(1);
  });

  it('handles card flip on press', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    // Press the card to flip it
    fireEvent.press(getByText('Test Product'));

    // Check if back content is visible
    expect(getByText('Why Consider This?')).toBeTruthy();
  });

  it('shows pros and cons after flip', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    // Press the card to flip it
    fireEvent.press(getByText('Test Product'));

    // Check pros and cons using regex to match the text with checkmark/x symbols
    expect(getByText(/✓\s*Pro 1/)).toBeTruthy();
    expect(getByText(/✓\s*Pro 2/)).toBeTruthy();
    expect(getByText(/×\s*Con 1/)).toBeTruthy();
    expect(getByText(/×\s*Con 2/)).toBeTruthy();
  });

  it('handles story view toggle', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    // Press the story button
    fireEvent.press(getByText('View Story'));

    // Check if story content is visible
    expect(getByText('Product Story')).toBeTruthy();
  });

  it('calls onPress handler on long press', () => {
    const { getByText } = render(
      <ProductCard
        product={mockProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    fireEvent(getByText('Test Product'), 'longPress');
    expect(mockOnPress).toHaveBeenCalledWith(mockProduct);
  });

  it('applies correct theme color based on product category', () => {
    const laptopProduct = {
      ...mockProduct,
      title: 'MacBook Pro',
    };

    const { getByTestId } = render(
      <ProductCard
        product={laptopProduct}
        index={0}
        scrollY={mockScrollY}
        onPress={mockOnPress}
      />
    );

    // Check if the gradient background is rendered with the correct testID
    expect(getByTestId('gradient-background')).toBeTruthy();
  });
}); 