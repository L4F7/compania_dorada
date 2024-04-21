import {
  collection,
  deleteDoc,
  getDocs,
  getFirestore,
  orderBy,
} from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import Categories from '../Components/HomeScreen/Categories';
import Header from '../Components/HomeScreen/Header';
import LatestActivityList from '../Components/HomeScreen/LatestActivityList';
import { ScrollView } from 'react-native-virtualized-view'
import { app } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {
  const [categoryList, setCategoryList] = useState([]);
  const [latestActivityList, setLatestActivityList] = useState([]);

  const db = getFirestore(app);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(
        collection(db, 'Category'),
        orderBy('createdAt', 'desc')
      );
      const newCategoryList = querySnapshot.docs.map((doc) => doc.data());
      setCategoryList(newCategoryList);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const deleteExpiredActivities = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'UserPost'));
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        const activityDate = new Date(data.date + 'T' + data.time + '.000Z');

        const moment = require('moment-timezone');
        const now = new Date(
          moment()
            .tz('America/Costa_Rica')
            .format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
            .split('.')[0] + '.000Z'
        );
        
        if (activityDate < now) {
          deleteDoc(doc.ref);
        }
      });
    } catch (error) {
      console.error('Error deleting expired activities:', error);
    }
  };
  new Date('2024-04-20T17:40:00.000Z') < new Date('2024-04-20T17:40:00.000Z');

  const getLatestActivityList = async () => {
    try {
      await deleteExpiredActivities();
      const querySnapshot = await getDocs(collection(db, 'UserPost'));
      const newLatestItemList = querySnapshot.docs.map((doc) => doc.data());
      setLatestActivityList(newLatestItemList);
    } catch (error) {
      console.error('Error fetching latest item list:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      getCategoryList();
      getLatestActivityList();
    }, [])
  );

  useEffect(() => {
    getCategoryList();
    getLatestActivityList();
  }, []);

  return (
    <ScrollView className="py-8 px-6 bg-white flex-1">
      <Header />
      <Categories categoryList={categoryList} />
      <LatestActivityList
        latestActivityList={latestActivityList}
        heading={'Ultimas Actividades'}
      />
    </ScrollView>
  );
}
