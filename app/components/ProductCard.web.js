import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

const ProductCard = ({ product, onPress }) => {
  const { title, price, rating, description } = product;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress(product)}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {rating}</Text>
          </View>
        </View>

        <Text style={styles.price}>${price.toLocaleString()}</Text>
        
        <Text style={styles.description} numberOfLines={3}>
          {description}
        </Text>

        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => onPress(product)}
          >
            <Text style={styles.buttonText}>View Details</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden',
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  ratingContainer: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  rating: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  price: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007AFF',
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 16,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default ProductCard; 