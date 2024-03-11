import { View, Text } from 'react-native'
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Screens/ProfileScreen';
import MyActivities from '../Screens/MyActivities';
import ActivityDetails from '../Screens/ActivityDetails';

const Stack = createStackNavigator();

export default function ProfileStackNavigation() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="profile-tab"
        component={ProfileScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="my-activities"
        component={MyActivities}
        options={{ headerTitle: 'Mis actividades' }}
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