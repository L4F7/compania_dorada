import React from 'react';
import AddActivityScreen from '../Screens/AddActivityScreen';
import HomeScreenStackNavigation from './HomeScreenStackNavigation';
import { FontAwesome5 } from '@expo/vector-icons';
import ExploreScreenStackNavigation from './ExploreScreenStackNavigation';
import ProfileStackNavigation from './ProfileStackNavigation';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';

const Tab = createMaterialBottomTabNavigator();

export default function TabNavigation() {
  const tabArray = [
    {
      name: 'home-nav',
      component: HomeScreenStackNavigation,
      title: 'Inicio',
      icon: 'home',
      tabBarColor: 'blue',
    },
    {
      name: 'explore',
      component: ExploreScreenStackNavigation,
      title: 'Explorar',
      icon: 'search',
      tabBarColor: 'green',
    },
    {
      name: 'add-activity',
      component: AddActivityScreen,
      title: 'Agregar Actividad',
      icon: 'calendar-plus',
      tabBarColor: 'purple',
    },
    {
      name: 'profile',
      component: ProfileStackNavigation,
      title: 'Perfil',
      icon: 'user-alt',
      tabBarColor: 'orange',
    },
  ];

  return (
    <Tab.Navigator
      options={{ headerShown: false }}
      inactiveColor="#ffffff"
      activeColor="#ffffff"
      shifting={true}
      barStyle={{ backgroundColor: '#0073e6'}}
      activeIndicatorStyle={{ 
        backgroundColor: 'transparent',
        height: 35,
        width: 50,
      }}
    >
      {tabArray.map((tab, index) => (
        <Tab.Screen
          height={30}
          key={index}
          name={tab.name}
          component={tab.component}
          options={{
            tabBarLabel: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <FontAwesome5 name={tab.icon} size={focused ? 30 : 24} color={color} />
            ),
          }}
        />
      ))}
    </Tab.Navigator>
  );
}
