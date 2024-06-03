import ActivityDetails from '../Screens/ActivityDetails';
import EditActivityScreen from '../Screens/EditActivityScreen';
import CreatedActivities from '../Screens/CreatedActivities';
import SubscribedActivities from '../Screens/SubscribedActivities';
import ProfileScreen from '../Screens/ProfileScreen';
import { createStackNavigator } from '@react-navigation/stack';

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
        name="created-activities"
        component={CreatedActivities}
        options={{ headerTitle: 'Actividades Creadas' }}
      />
      <Stack.Screen
        name="subscribed-activities"
        component={SubscribedActivities}
        options={{ headerTitle: 'Actividades Suscritas' }}
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