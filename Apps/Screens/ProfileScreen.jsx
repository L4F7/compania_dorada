import { View, Text, TouchableOpacity} from 'react-native'
import React from 'react'
import { auth } from '../../firebaseConfig'
import { useNavigation } from '@react-navigation/core'

export default function ProfileScreen() {

  const navigation = useNavigation()

  return (
    <View className="mt-10" >
      <Text>ProfileScreen</Text>
      <TouchableOpacity
        onPress={() => {
          auth.signOut().then(() => {
            navigation.navigate('Login');
          });
        }}
      >
        <Text>Logout</Text>
      </TouchableOpacity>
    </View>
  )
}