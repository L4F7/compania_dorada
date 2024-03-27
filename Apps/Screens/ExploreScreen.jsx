import { ActivityIndicator, ScrollView, Text, View } from 'react-native';
import { collection, getDocs, orderBy } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import LatestActivityList from '../Components/HomeScreen/LatestActivityList';
import { db } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function ExploreScreen() {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(true);

  const getAllActivityList = async () => {
    try {
      setLoading(true);
      const querySnapshot = await getDocs(
        collection(db, 'UserPost'),
        orderBy('createdAt', 'desc')
      );
      const newActivityList = querySnapshot.docs.map((doc) => doc.data());
      setActivityList(newActivityList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest item list:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllActivityList();
  }, []);

  useFocusEffect(
    useCallback(() => {
      getAllActivityList();
    }, [])
  );

  return (
    <ScrollView className="p-5 py-10">
      <Text className="text-[27px] font-bold">Todas las actividades</Text>
      {loading ? (
        <ActivityIndicator
          className="mt-10 mb-10"
          size={'large'}
          color={'blue'}
        />
      ) : activityList.length > 0 ? (
        <LatestActivityList
          latestActivityList={activityList}
          heading=""
        />
      ) : (
        <View className="h-[400px] w-full items-center justify-center">
          <Text className="text-[20px] text-gray-400 text-center">
            No hay actividades en este de momento 😢
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
