import 'react-native-reanimated';
import { Stack } from 'expo-router';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: '#000',
          },
          headerTintColor: '#fff',
          contentStyle: {
            backgroundColor: '#000',
          },
        }}
      >
        <Stack.Screen 
          name="index" 
          options={{
            title: 'The Curator',
          }}
        />
      </Stack>
    </GestureHandlerRootView>
  );
} 