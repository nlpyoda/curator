import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import ProductRow from './components/ProductRow';
import ProductDetail from './components/ProductDetail';

// Mock Agents
const amazonAgent = (query, budget) => {
  console.log('amazonAgent called with:', query, budget);
  const results = [
    { id: 1, title: `${query} Ninja`, price: 45.00, link: 'https://amazon.com/ninja?tag=curator-20', score: 0.9, facts: ['500W', 'Smoothie Pro', 'Black'], review: '4.5 stars - Blends like a beast!', whyBuy: 'Perfect for smoothie freaks' },
    { id: 2, title: `${query} Basic`, price: 35.00, link: 'https://amazon.com/basic?tag=curator-20', score: 0.7, facts: ['300W', 'Simple', 'White'], review: '4 stars - Solid budget pick.', whyBuy: 'Cheap and reliable' }
  ].filter(item => item.price <= budget);
  console.log('amazonAgent results:', results);
  return results;
};

const webAgent = (query, budget) => {
  console.log('webAgent called with:', query, budget);
  const results = [
    { id: 3, title: `${query} Walmart Deal`, price: 42.00, link: 'https://walmart.com/deal', score: 0.85, facts: ['450W', 'Durable', 'Gray'], review: '4.2 stars - Great value!', whyBuy: 'Beats Amazon on price' }
  ].filter(item => item.price <= budget);
  console.log('webAgent results:', results);
  return results;
};

const localAgent = (query) => {
  console.log('localAgent called with:', query);
  const results = [
    { id: 4, title: `${query} from @localdude`, price: 40.00, link: 'DM @localdude', score: 0.8, facts: ['400W', 'Used', 'Red'], review: 'No rating - Local gem!', whyBuy: 'Fast pickup, support locals' }
  ];
  console.log('localAgent results:', results);
  return results;
};

const personalizeResults = (items, prefs) => {
  console.log('personalizeResults called with:', items, prefs);
  const scoredItems = items.map(item => ({
    ...item,
    score: prefs.smoothieFreak && item.title.includes('Ninja') ? item.score + 0.1 : item.score
  }));
  const results = scoredItems.sort((a, b) => b.score - a.score).slice(0, 5);
  console.log('personalizeResults output:', results);
  return results;
};

export default function App() {
  console.log('App component rendering');
  const [query, setQuery] = useState('');
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);

  const search = () => {
    console.log('search called with query:', query);
    const budget = 50.0;
    const prefs = { smoothieFreak: true };
    const amazonResults = amazonAgent(query || 'blender', budget);
    const webResults = webAgent(query || 'blender', budget);
    const localResults = localAgent(query || 'blender');
    const combinedResults = [...amazonResults, ...webResults, ...localResults];
    console.log('Combined results:', combinedResults);
    const personalizedResults = personalizeResults(combinedResults, prefs);
    console.log('Setting items to:', personalizedResults);
    setItems(personalizedResults);
  };

  useEffect(() => {
    console.log('Initial useEffect running');
    search();
  }, []);

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Type it, bruh"
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={search}
        placeholderTextColor="#666"
      />
      <TouchableOpacity style={styles.voiceButton} onPress={search}>
        <Text style={styles.voiceText}>Say it, bruh</Text>
      </TouchableOpacity>
      {items.length > 0 ? (
        <FlatList
          data={items}
          renderItem={({ item }) => <ProductRow item={item} onPress={() => setSelectedItem(item)} />}
          keyExtractor={item => item.id.toString()}
          style={styles.list}
        />
      ) : (
        <Text style={styles.empty}>Say or type somethin', bruh</Text>
      )}
      {selectedItem && (
        <ProductDetail item={selectedItem} visible={!!selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    paddingTop: 20
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 15,
    margin: 20,
    borderRadius: 10,
    fontFamily: 'monospace'
  },
  voiceButton: {
    backgroundColor: '#00f',
    padding: 15,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: 'center'
  },
  voiceText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    fontFamily: 'monospace'
  },
  list: {
    marginTop: 20
  },
  empty: {
    color: '#666',
    fontSize: 20,
    fontWeight: 'bold',
    fontFamily: 'monospace',
    textAlign: 'center',
    marginTop: 50
  }
}); 