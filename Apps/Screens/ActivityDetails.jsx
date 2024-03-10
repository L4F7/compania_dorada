import { View, Text, Image, ScrollView, TouchableOpacity, Share } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';

export default function ActivityDetails({ navigation}) {

    const {params} = useRoute();  
    const [activity, setActivity] = useState({});

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
    }

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
    }

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
        <Text className="text-[17px] text-gray-600">{activity.description}</Text>

        <View className="p-3 flex flex-row items-center mt-3 rounded-md bg-blue-100">
          <MaterialCommunityIcons name="contacts" size={36} color="black" />
          <View>
            <Text className="text-[20px] font-bold">Creado por:</Text>
            <Text className="text-[16px] text-gray-600">
              {activity.userEmail}
            </Text>
          </View>
        </View>
      </View>
      <View className=" pl-3 pr-3 mb-5">
        <TouchableOpacity className=" bg-blue-500 w-full p-3 rounded-full">
          <Text className="text-center text-white font-bold text-[20px]">
            ¡Participar!
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}