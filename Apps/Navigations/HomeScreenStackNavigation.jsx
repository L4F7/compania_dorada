import ActivityDetails from '../Screens/ActivityDetails';
import ActivityList from '../Screens/ActivityList';
import EditActivityScreen from '../Screens/EditActivityScreen';
import HomeScreen from '../Screens/HomeScreen';
import { createStackNavigator } from '@react-navigation/stack';

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
      <Stack.Screen
        name="edit-activity"
        component={EditActivityScreen}
        options={{
          headerTitle: 'Editar actividad',
        }}
      />
    </Stack.Navigator>
  );
}
