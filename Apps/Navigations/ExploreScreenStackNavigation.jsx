import ActivityDetails from '../Screens/ActivityDetails';
import ExploreScreen from '../Screens/ExploreScreen';
import { createStackNavigator } from '@react-navigation/stack';

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
