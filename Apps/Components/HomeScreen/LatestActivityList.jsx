import {
  FlatList,
  Text,
  View,
} from 'react-native';

import ActivityItem from './ActivityItem';

export default function LatestActivityList({ latestActivityList, heading }) {
  return (
    <View>
      <Text className="font-bold text-[25px]">{heading}</Text>
      {latestActivityList.length > 0 ? (
        <FlatList
        data={latestActivityList}
        numColumns={2}
        renderItem={({ item, index }) => (
          <ActivityItem item={item} />
        )}
      />
      ) : (
        <View className="h-[200px] w-full items-center justify-center">
          <Text className="text-[20px] text-gray-400 text-center">
            No hay actividades en este de momento 😢
          </Text>
        </View>
      )}
    </View>
  );
}
