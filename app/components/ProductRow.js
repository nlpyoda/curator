import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';

export default function ProductRow({ item, onPress }) {
  return (
    <TouchableOpacity style={styles.row} onPress={onPress}>
      <Text style={styles.title}>{item.title}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    marginHorizontal: 20,
    backgroundColor: '#333',
    borderRadius: 12,
    shadowColor: '#00f',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 5,
    marginBottom: 10
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'monospace'
  },
  price: {
    color: '#0f0',
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  }
}); 