import { View, Text, FlatList, Image, ScrollView, TouchableOpacity } from 'react-native'
import React from 'react'
import ActivityItem from './ActivityItem';

export default function LatestActivityList({latestActivityList, heading}) {
  return (
    <View>
      <Text className="font-bold text-[20px]">
        {heading}
      </Text>
      <FlatList
        data={latestActivityList}
        numColumns={2}
        renderItem={({ item, index }) => (
          <ActivityItem item={item} />
        )}
      />
    </View>
  );
}