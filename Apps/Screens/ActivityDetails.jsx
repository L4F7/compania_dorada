import {
  Alert,
  Image,
  ScrollView,
  Share,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  addDoc,
  collection,
  deleteDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { useEffect, useState } from 'react';

import Button from '../Components/Button';
import { FontAwesome5 } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

export default function ActivityDetails({ navigation }) {
  const { params } = useRoute();
  const [activity, setActivity] = useState({});
  const [formattedDateTime, setFormattedDateTime] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [totalParticipants, setTotalParticipants] = useState(0);

  const user = auth.currentUser;
  const nav = useNavigation();

  useEffect(() => {
    if (params) {
      params && setActivity(params.activity);
      params && formatDateTime();
      params && checkIfUserIsSubscribed(params.activity.id);
      params && checkTotalParticipants(params.activity.id);
    }
    shareButton();
  }, [params, navigation]);

  const checkTotalParticipants = async (activityId) => {
    const q = query(collection(db, 'UserPost'), where('id', '==', activityId));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setTotalParticipants(doc.data().currentParticipants);
    });
  };

  const shareActivity = async () => {
    try {
      await Share.share({
        message: `¡Participa en esta actividad! ${activity.title} en ${activity.location}`,
      });
    } catch (error) {
      console.log(error.message);
    }
  };

  const shareButton = () => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => shareActivity()}>
          <FontAwesome5
            name="share-alt"
            size={24}
            color="black"
            style={{ marginRight: 15 }}
          />
        </TouchableOpacity>
      ),
    });
  };

  const checkIfUserIsSubscribed = async (activityId) => {
    console.log('activityId', activityId);
    const q = query(
      collection(db, 'ActivityUserPost'),
      where('userEmail', '==', user.email),
      where('postId', '==', activityId)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().postId === activityId) {
        setSubscribed(true);
      }
    });
  };

  const enrollUserToActivity = async () => {
    const value = {
      postId: activity.id,
      userEmail: user.email,
    };
    const docRef = await addDoc(collection(db, 'ActivityUserPost'), value);
    if (docRef.id) {
      Alert.alert('¡Felicidades!', 'Te has inscrito a esta actividad');
      setSubscribed(true);
    }
  };

  const subscribeToActivity = async () => {
    const q = query(collection(db, 'UserPost'), where('id', '==', activity.id));

    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {
      if (doc.data().currentParticipants < doc.data().maxParticipants) {
        updateDoc(doc.ref, {
          currentParticipants: doc.data().currentParticipants + 1,
        }).then(() => {
          enrollUserToActivity();
          setTotalParticipants(doc.data().currentParticipants + 1);
        });
      } else {
        Alert.alert('¡Lo sentimos!', 'Esta actividad ya no tiene cupo');
      }
    });
  };

  const unenrollUserToActivity = async () => {
    const q = query(
      collection(db, 'ActivityUserPost'),
      where('userEmail', '==', user.email),
      where('postId', '==', activity.id)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref).then(() => {
        setSubscribed(false);
      });
    });
  };

  const unsubscribeToActivity = async () => {
    const q = query(collection(db, 'UserPost'), where('id', '==', activity.id));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      if (doc.data().currentParticipants > 0) {
        updateDoc(doc.ref, {
          currentParticipants: doc.data().currentParticipants - 1,
        }).then(() => {
          unenrollUserToActivity();
          setTotalParticipants(doc.data().currentParticipants - 1);
          Alert.alert('¡Listo!', 'Has cancelado tu participación');
        });
      } else {
        Alert.alert('¡Lo sentimos!', 'No puedes cancelar tu participación en este momento');
      }
    });
  };

  const deleteUserActivity = () => {
    Alert.alert(
      'Eliminar actividad',
      '¿Estás seguro de querer eliminar esta actividad?',
      [
        {
          text: 'Cancelar',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Eliminar',
          onPress: () => {
            deleteFromFirebase();
          },
        },
      ]
    );
  };

  const deleteFromFirebase = async () => {
    const q = query(collection(db, 'UserPost'), where('id', '==', activity.id));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref).then(() => {
        console.log('Document successfully deleted!');
        nav.goBack();
      });
    });
  };

  const formatTime = (time) => {
    let hours = time.split(':')[0];
    let minutes = time.split(':')[1];
    let formatedTime =
      hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
    return formatedTime;
  };

  const formatDateTime = () => {
    const date = params.activity.date;
    const time = params.activity.time;

    const months = {
      '01': 'Enero',
      '02': 'Febrero',
      '03': 'Marzo',
      '04': 'Abril',
      '05': 'Mayo',
      '06': 'Junio',
      '07': 'Julio',
      '08': 'Agosto',
      '09': 'Septiembre',
      10: 'Octubre',
      11: 'Noviembre',
      12: 'Diciembre',
    };

    const newDate = date.split('-');
    const year = newDate[0];
    const month = newDate[1];
    const day = newDate[2];

    const newTime = formatTime(time);

    setFormattedDateTime(
      `${day} de ${months[month]} del ${year} a las ${newTime}`
    );
  };
  return (
    <ScrollView>
      <Image className="h-[350px] w-full" source={{ uri: activity.image }} />
      <View className="p-3 bg-white">
        <Text className="text-[24px] font-bold">{activity.title}</Text>
        <View className="items-baseline">
          <Text
            className=" text-blue-500 font-bold bg-blue-200 p-1 mt-1
            rounded-full px-2 text-[15px]"
          >
            {activity.category}
          </Text>
        </View>
        <Text className="text-[20px] font-bold mt-3">Ubicación</Text>
        <Text className="text-[17px] text-gray-600">{activity.location}</Text>
        <Text className="text-[20px] font-bold mt-3">Fecha y hora</Text>
        <Text className="text-[17px] text-gray-600">{formattedDateTime}</Text>
        <Text className="text-[20px] font-bold mt-3">Descripción</Text>
        <Text className="text-[17px] text-gray-600">
          {activity.description}
        </Text>
        <Text className="text-[20px] font-bold mt-3">Cupo</Text>
        <Text className="text-[17px] text-gray-600">
          {totalParticipants}/{activity.maxParticipants}
        </Text>

        <View className="p-3 flex flex-row items-center mt-3 rounded-md bg-blue-100">
          <MaterialCommunityIcons name="contacts" size={36} color="black" />
          <View className="ml-2">
            <Text className="text-[20px] font-bold">Creado por:</Text>
            <Text className="text-[16px] text-gray-600">
              {activity.userEmail}
            </Text>
          </View>
        </View>
      </View>
      <View className=" pl-3 pr-3 mb-5">
        {user.email !== activity.userEmail ? (
          subscribed ? (
            <Button 
              title={'Cancelar participación'}
              onPress={unsubscribeToActivity}
              bgColor={'red-500'}
              width={'w-full'}
            />
          ) : (
            <Button 
              title={'¡Participar!'}
              onPress={subscribeToActivity}
              bgColor={'blue-500'}
              width={'w-full'}
            />
          )
        ) : (
          <Button 
            title={'Eliminar actividad'}
            onPress={deleteUserActivity}
            bgColor={'red-500'}
            width={'w-full'}
          />
        )}
      </View>
    </ScrollView>
  );
}
