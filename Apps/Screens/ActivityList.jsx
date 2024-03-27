import { ActivityIndicator, View } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import LatestActivityList from '../Components/HomeScreen/LatestActivityList';
import { db } from '../../firebaseConfig';
import { useRoute } from '@react-navigation/native';

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
      ) : (
        <LatestActivityList latestActivityList={activityList} heading={``} />
      )}
    </View>
  );
}
