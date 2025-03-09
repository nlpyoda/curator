import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal } from 'react-native';
import { PanGestureHandler } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

export default function ProductDetail({ item, visible, onClose }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const rotation = useSharedValue(0);

  const frontStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value}deg` }],
    opacity: rotation.value < 90 ? 1 : 0
  }));

  const backStyle = useAnimatedStyle(() => ({
    transform: [{ rotateY: `${rotation.value + 180}deg` }],
    opacity: rotation.value >= 90 ? 1 : 0
  }));

  const flipCard = () => {
    rotation.value = withTiming(isFlipped ? 0 : 180, { duration: 500 });
    setIsFlipped(!isFlipped);
  };

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.modal}>
        <PanGestureHandler onGestureEvent={() => onClose()}>
          <Animated.View style={[styles.tileContainer, frontStyle]}>
            <Text style={styles.tileTitle}>{item.title}</Text>
            {item.facts.map((fact, i) => (
              <Text key={i} style={styles.fact}>• {fact}</Text>
            ))}
          </Animated.View>
        </PanGestureHandler>
        <PanGestureHandler onGestureEvent={() => onClose()}>
          <Animated.View style={[styles.tileContainer, backStyle, styles.backTile]}>
            <Text style={styles.reviewTitle}>Review</Text>
            <Text style={styles.reviewText}>{item.review}</Text>
            <Text style={styles.reviewTitle}>Why Buy</Text>
            <Text style={styles.reviewText}>{item.whyBuy}</Text>
          </Animated.View>
        </PanGestureHandler>
        <TouchableOpacity style={styles.flipButton} onPress={flipCard}>
          <Text style={styles.flipText}>Flip It</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buyButton} onPress={() => console.log(`Bought: ${item.link}`)}>
          <Text style={styles.buyText}>Buy Now</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.8)'
  },
  tileContainer: {
    width: 300,
    height: 400,
    padding: 20,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    position: 'absolute'
  },
  backTile: {
    backgroundColor: '#00f'
  },
  tileTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginBottom: 20
  },
  fact: {
    color: '#ccc',
    fontSize: 16,
    fontFamily: 'monospace'
  },
  reviewTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    marginTop: 10
  },
  reviewText: {
    color: '#ccc',
    fontSize: 16,
    fontFamily: 'monospace'
  },
  flipButton: {
    marginTop: 450,
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10
  },
  flipText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  },
  buyButton: {
    marginTop: 10,
    backgroundColor: '#0f0',
    padding: 10,
    borderRadius: 10
  },
  buyText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold'
  }
}); 