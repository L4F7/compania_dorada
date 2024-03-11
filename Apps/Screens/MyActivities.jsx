import { View, Text, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db, auth } from '../../firebaseConfig';
import LatestActivityList from '../Components/HomeScreen/LatestActivityList';

export default function MyActivities() {
  const user = auth.currentUser;
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserActivities = async () => {
    try {
      setLoading(true);
      const q = query(
        collection(db, 'UserPost'),
        where('userEmail', '==', user.email)
      );
      const querySnapshot = await getDocs(q);
      const newActivityList = querySnapshot.docs.map((doc) => doc.data());
      setUserActivities(newActivityList);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching user activities:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    user && getUserActivities();
  }, [user]);

  return (
    <View>
      {loading ? (
        <ActivityIndicator
          className="mt-10 mb-10"
          size={'large'}
          color={'blue'}
        />
      ) : userActivities.length > 0 ? (
        <LatestActivityList latestActivityList={userActivities} heading="" />
      ) : (
        <View className="h-full w-full items-center justify-center">
          <Text className="text-[20px] text-gray-400 text-center">
            No hay actividades en este de momento 😢
          </Text>
        </View>
      )}
    </View>
  );
}