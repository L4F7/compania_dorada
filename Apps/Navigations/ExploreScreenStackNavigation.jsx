import { View, Text } from 'react-native';
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ActivityList from '../Screens/ActivityList';
import ActivityDetails from '../Screens/ActivityDetails';
import ExploreScreen from '../Screens/ExploreScreen';

const Stack = createStackNavigator();

export default function ExploreScreenStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="explore-tab"
        component={ExploreScreen}
        options={{
          headerShown: false,
        }}
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
