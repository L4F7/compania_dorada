import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Share,
  Alert,
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { auth, db } from '../../firebaseConfig';
import { getDocs, deleteDoc, query, collection, where } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

export default function ActivityDetails({ navigation }) {
  const { params } = useRoute();
  const [activity, setActivity] = useState({});

  const user = auth.currentUser;
  const nav= useNavigation();

  useEffect(() => {
    params && setActivity(params.activity);
    shareButton();
  }, [params, navigation]);

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

  const subscribeToActivity = () => {
    console.log('Subscribiendo a actividad');
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
    const q = query(
      collection(db, 'UserPost'),
      where('title', '==', activity.title),
      where('createdAt', '==', activity.createdAt),
      where('userEmail', '==', activity.userEmail)
    );
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      deleteDoc(doc.ref).then(() => {
        console.log('Document successfully deleted!');
        nav.goBack();
      });
    });
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
        <Text className="text-[20px] font-bold mt-3">Descripción</Text>
        <Text className="text-[17px] text-gray-600">
          {activity.description}
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
          <TouchableOpacity className=" bg-blue-500 w-full p-3 rounded-full">
            <Text className="text-center text-white font-bold text-[20px]">
              ¡Participar!
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            className=" bg-red-500 w-full p-3 rounded-full mt-3"
            onPress={deleteUserActivity}
          >
            <Text className="text-center text-white font-bold text-[20px]">
              Eliminar actividad
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}
