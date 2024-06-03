import { FlatList, Image, Text, TouchableOpacity, View } from 'react-native';
import { auth, removeData } from '../../firebaseConfig';

import activities from '../../assets/images/activities.png';
import logout from '../../assets/images/logout.png';
import checklist from '../../assets/images/checklist.png';
import { useNavigation } from '@react-navigation/core';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const navigation = useNavigation();

  const menuList = [
    {
      id: 1,
      title: 'Actividades Creadas',
      icon: activities,
      onPress: () => {
        navigation.navigate('created-activities');
      },
    },
    {
      id: 2,
      title: 'Actividades Suscritas',
      icon: checklist,
      onPress: () => {
        navigation.navigate('subscribed-activities');
      },
    },
    {
      id: 3,
      title: 'Cerrar sesión',
      icon: logout,
      onPress: () => {
        removeData('user');
        auth.signOut();
        navigation.navigate('Login');
      },
    },
  ];

  return (
    <View className="p-5 bg-white flex-1">
      <View className="items-center mt-14">
        <Image
          source={require('../../assets/images/profile.png')}
          className="w-[125px] h-[125px]"
        />
        <Text className="text-3xl font-bold mt-5">Perfil</Text>
        <Text className="text-lg mt-2">Email: {user.email}</Text>
      </View>
      <FlatList
        data={menuList}
        numColumns={2}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            className="flex-1 p-5 border-[1px] items-center
        mx-2 mt-4 rounded-lg border-blue-400 bg-blue-50"
            onPress={item.onPress}
          >
            <Image source={item.icon} className="w-[100px] h-[100px]" />
            <Text className="text-lg font-bold mt-2">{item.title}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
