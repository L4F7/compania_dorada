// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: 'AIzaSyAfX8saXbcyT2vppwu3o1dve3_4Fe-kYL4',
  authDomain: 'compania-dorada.firebaseapp.com',
  projectId: 'compania-dorada',
  storageBucket: 'compania-dorada.appspot.com',
  messagingSenderId: '1057930393073',
  appId: '1:1057930393073:web:81987948471b36e9b2c050',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const storeData = async (value) => {
  try {
    await AsyncStorage.setItem('user', value);
  }
  catch (e) {
    console.log(e);
  }
}

const getData = async () => {
  try {
    const value = await AsyncStorage.getItem('user');
    if (value !== null) {
      return value;
    }
  }
  catch (e) {
    console.log(e);
  }
}

const removeData = async () => {
  try {
    await AsyncStorage.removeItem('user');
  }
  catch (e) {
    console.log(e);
  }
}

export { auth, db, storeData, getData, removeData };
