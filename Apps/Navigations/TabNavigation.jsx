import { Text } from 'react-native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AddActivityScreen from '../Screens/AddActivityScreen';
import HomeScreenStackNavigation from './HomeScreenStackNavigation';
import { FontAwesome5 } from '@expo/vector-icons';
import ExploreScreenStackNavigation from './ExploreScreenStackNavigation';
import ProfileStackNavigation from './ProfileStackNavigation';

const Tab = createBottomTabNavigator();

export default function TabNavigation() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        //tabBarActiveTintColor:'#fff'
      }}
    >
      <Tab.Screen
        name="home-nav"
        component={HomeScreenStackNavigation}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
              Inicio
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="home" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="explore"
        component={ExploreScreenStackNavigation}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
              Explorar
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="search" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="add-activity"
        component={AddActivityScreen}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
              Agregar Actividad
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="calendar-plus" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="profile"
        component={ProfileStackNavigation}
        options={{
          tabBarLabel: ({ color }) => (
            <Text style={{ color: color, fontSize: 12, marginBottom: 3 }}>
              Perfil
            </Text>
          ),
          tabBarIcon: ({ color, size }) => (
            <FontAwesome5 name="user-alt" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
