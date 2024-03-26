import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';

export default function Categories({ categoryList }) {
  const navigation = useNavigation();

  return (
    <View className="mt-3">
      <Text className="font-bold text-[25px]">Categorías</Text>
      {categoryList.length > 0 ? (
        <FlatList
          horizontal={true}
          data={categoryList}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('activity-list', { category: item.name })
              }
              className="flex-1 items-center justify-center p-2 border-[1px] border-gray-300 m-1 h-[125px] w-[125px] rounded-lg bg-blue-50 border-blue200"
            >
              <Image
                source={{ uri: item.icon }}
                className=" w-[75px] h-[75px] "
              />
              <Text className="text-[20px] mt-1 font-bold"> {item.name}</Text>
            </TouchableOpacity>
          )}
        />
      ) : (
        <ActivityIndicator
          className="mt-10 mb-10"
          size={'large'}
          color={'blue'}
        />
      )}
    </View>
  );
}
