import { collection, getDocs, getFirestore, orderBy } from 'firebase/firestore';
import { useCallback, useEffect, useState } from 'react';

import Categories from '../Components/HomeScreen/Categories';
import Header from '../Components/HomeScreen/Header'
import LatestActivityList from '../Components/HomeScreen/LatestActivityList';
import { ScrollView } from 'react-native'
import { app } from '../../firebaseConfig';
import { useFocusEffect } from '@react-navigation/native';

export default function HomeScreen() {

  const [categoryList, setCategoryList] = useState([]);
  const [latestActivityList, setLatestActivityList] = useState([]);

  const db = getFirestore(app);

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Category'), orderBy('createdAt', 'desc'));
      const newCategoryList = querySnapshot.docs.map((doc) => doc.data());
      setCategoryList(newCategoryList);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  const getLatestActivityList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'UserPost'));
      const newLatestItemList = querySnapshot.docs.map((doc) => doc.data());
      setLatestActivityList(newLatestItemList);
    } catch (error) {
      console.error('Error fetching latest item list:', error);
    }
  }

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