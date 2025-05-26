import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeScreen from './src/screens/HomeScreen';
import MotoListScreen from './src/screens/MotoListScreen';
import MotoFormScreen from './src/screens/MotoFormScreen';
import MotoDetailScreen from './src/screens/MotoDetailScreen';
import SettingsScreen from './src/screens/SettingsScreen';

export type RootStackParamList = {
  Home: undefined;
  MotoList: undefined;
  MotoForm: undefined;
  MotoDetail: undefined;
  Settings: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1E1E1E', // header preto
          },
          headerTintColor: '#FFFFFF', // texto branco
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="MotoList" component={MotoListScreen} />
        <Stack.Screen name="MotoForm" component={MotoFormScreen} />
        <Stack.Screen name="MotoDetail" component={MotoDetailScreen} />
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
