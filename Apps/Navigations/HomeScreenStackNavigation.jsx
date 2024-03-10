import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../Screens/HomeScreen';
import ActivityList from '../Screens/ActivityList';
import ActivityDetails from '../Screens/ActivityDetails';

const Stack = createStackNavigator();

export default function HomeScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="home"
        component={HomeScreen}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="activity-list"
        component={ActivityList}
        options={({ route }) => ({
          title: route.params.category,
          //   headerStyle: {
          //     backgroundColor: '#f4511e',
          //   },
          //   headerTintColor: '#fff',
        })}
      />
      <Stack.Screen
        name="activity-details"
        component={ActivityDetails}
        options={{
          headerTitle: 'Detalles de la actividad',
        }}
      />
    </Stack.Navigator>
  );
}
