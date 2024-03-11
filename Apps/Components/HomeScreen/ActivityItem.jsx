import { View, Text, TouchableOpacity, Image } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export default function ActivityItem({ item }) {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      className="flex-1 m-2 p-2 rounded-lg  border-[2px] border-gray-200 bg-gray-50"
      onPress={() => {
        navigation.push('activity-details', { activity: item });
      }}
    >
      <Image
        source={{ uri: item.image }}
        className="w-full h-[140px]
          rounded-lg"
      />
      <View>
        <View className="items-baseline">
          <Text
            className=" text-blue-900 font-bold bg-blue-200 p-1 mt-1
            rounded-full px-2 text-[15px]"
          >
            {item.category}
          </Text>
        </View>
        <Text className="font-bold text-[16px] mt-2">{item.title}</Text>
        <Text className="text-[14px] mt-2">{item.location}</Text>
      </View>
    </TouchableOpacity>
  );
}
