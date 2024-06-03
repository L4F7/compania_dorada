import { ActivityIndicator, Text, View } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { useEffect, useState } from 'react';

import LatestActivityList from '../Components/HomeScreen/LatestActivityList';

export default function MyActivities() {
  const user = auth.currentUser;
  const [userActivities, setUserActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const getUserActivities = async () => {
    setLoading(true);
  
    try {
      // Query to get all user activity posts
      const q = query(
        collection(db, 'ActivityUserPost'),
        where('userEmail', '==', user.email)
      );
      
      const querySnapshot = await getDocs(q);
      
      // Extract post IDs from the query snapshot
      const postIds = querySnapshot.docs.map(doc => doc.data().postId);
      
      // Fetch all user posts concurrently
      const postPromises = postIds.map(postId => {
        const q1 = query(collection(db, 'UserPost'), where('id', '==', postId));
        return getDocs(q1);
      });
      
      const querySnapshots = await Promise.all(postPromises);
      
      // Flatten the results and extract data
      const newActivityList = querySnapshots.flatMap(snapshot => 
        snapshot.docs.map(doc => doc.data())
      );
      
      // Update state with the fetched activities
      setUserActivities(newActivityList);
    } catch (error) {
      console.error('Error fetching user activities:', error);
    } finally {
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