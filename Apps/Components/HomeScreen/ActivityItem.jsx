import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'


export default function ActivityItem({item}) {
  return (
    <TouchableOpacity className="flex-1 m-2 p-2 rounded-lg  border-[2px] border-gray-200">
      <Image
        source={{ uri: item.image }}
        className="w-full h-[140px]
          rounded-lg"
      />
      <View>
        <Text
          className=" text-blue-900 font-bold bg-blue-200 p-1 mt-1
            rounded-full px-2 text-[15px] w-[fit-content]"
        >
          {item.category}
        </Text>
        <Text className="font-bold text-[16px] mt-2">{item.title}</Text>
        <Text className="text-[14px] mt-2">{item.location}</Text>
      </View>
    </TouchableOpacity>
  );
}