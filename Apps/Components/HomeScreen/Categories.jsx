import { View, Text, FlatList, Image, TouchableOpacity } from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Categories({ categoryList }) {
  const navigation = useNavigation();

  return (
    <View className="mt-3">
      <Text className="font-bold text-[20px]">Categorías</Text>
      <FlatList
        numColumns={3}
        data={categoryList}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('activity-list', { category: item.name })
            }
            className="flex-1 items-center justify-center
          p-2 border-[1px] border-gray-300 m-1 h-[115px] rounded-lg
           bg-blue-50 border-blue200"
          >
            <Image source={{ uri: item.icon }} className=" w-[50%] h-[50%] " />
            <Text className="text-[12px] mt-1"> {item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}
