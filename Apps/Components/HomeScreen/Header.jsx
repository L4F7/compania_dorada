import { View, TextInput, Text } from 'react-native';
import React from 'react';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth } from '../../../firebaseConfig';

export default function Header() {

  const user = auth.currentUser;

  return (
    <View>
      {/* User Info Section */}
      <View className="flex flex-row items-center gap-2">
        {/* <Image
          source={{ uri: user.imageUrl }}
          className="rounded-full h-12 w-12"
        /> */}
        <View>
          <Text className="text-[16px]">Bienvenido</Text>
          <Text className="text-[20px] font-bold">{user.email}</Text>
        </View>
      </View>

      {/* Search bar */}

      <View
        className="p-4 px-5 flex flex-row items-center
        bg-blue-50 rounded-full border-[1px] mt-5 border-blue-300"
      >
        <FontAwesome5 name="search" size={24} color="gray" />
        <TextInput
          placeholder="Buscar"
          className="ml-2 text-[18px]"
          onChangeText={(value) => console.log(value)}
        />
      </View>
    </View>
  );
}