import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { db } from '../../firebaseConfig';
import { getDocs, collection, where, query } from 'firebase/firestore';
import LatestActivityList from '../Components/HomeScreen/LatestActivityList';

export default function ActivityList() {
  const [activityList, setActivityList] = useState([]);
  const [loading, setLoading] = useState(false);
  const { params } = useRoute();

  const getActivityListByCategory = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'UserPost'),
        where('category', '==', params.category)
      );
      const querySnapshot = await getDocs(q);
      const newActivityList = querySnapshot.docs.map((doc) => doc.data());
      setActivityList(newActivityList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching latest item list:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    params && getActivityListByCategory();
  }, []);

  return (
    <View className="p-2">
      {loading ? (
        <ActivityIndicator className="mt-24" size={'large'} color={'black'} />
      ) : activityList?.length > 0 ? (
        <LatestActivityList latestActivityList={activityList} heading={``} />
      ) : (
        <Text className="p-5 text-[20px] text-gray-400 text-center">
          No hay actividades en esta categoría de momento
        </Text>
      )}
    </View>
  );
}
