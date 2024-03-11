import { View, Text, TouchableOpacity, Image, FlatList } from 'react-native';
import React from 'react';
import { auth } from '../../firebaseConfig';
import { useNavigation } from '@react-navigation/core';
import activities from '../../assets/images/activities.png';
import search from '../../assets/images/search.png';
import logout from '../../assets/images/logout.png';

export default function ProfileScreen() {
  const user = auth.currentUser;

  const navigation = useNavigation();

  const menuList = [
    {
      id: 1,
      title: 'Mis actividades',
      icon: activities,
      onPress: () => {
        navigation.navigate('my-activities');
      },
    },
    {
      id: 2,
      title: 'Explorar',
      icon: search,
      onPress: () => {
        navigation.navigate('explore');
      },
    },
    {
      id: 3,
      title: 'Cerrar sesión',
      icon: logout,
      onPress: () => {
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
