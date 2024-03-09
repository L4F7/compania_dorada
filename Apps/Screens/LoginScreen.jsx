import { View, Text, Image, TouchableOpacity, TextInput, Alert } from 'react-native';
import React, { useEffect } from 'react';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { useNavigation } from '@react-navigation/core'


export default function LoginScreen() {
  const [email, setEmail] = React.useState('')
  const [password, setPassword] = React.useState('')

  const navigation = useNavigation()

  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user.email)
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
      });
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigation.replace('tab-navigation');
      } else {
        console.log('No user is signed in')
      }
    });
    return unsubscribe;
  }, []);

  return (
    <View>
      <Image
        source={require('./../../assets/images/login.jpg')}
        className="w-full h-[400px] object-cover"
      />
      <View className="p-8 bg-white mt-[-20px] rounded-t-3xl shadow-md">
        <Text className="text-[30px] font-bold">Compañia Dorada</Text>
        <Text className="text-[18px] text-slate-500 mt-6">
          Actividades para compartir y conocer nuevas personas
        </Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Correo electrónico"
          className="border-b-2 border-slate-300 mt-6"
        />
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Contraseña"
          className="border-b-2 border-slate-300 mt-6"
        />
        {/** Sign in and Sign up */}
        <TouchableOpacity
          onPress={handleLogin}
          className="p-3 bg-blue-500 rounded-full mt-20"
        >
          <Text className="text-white text-center text-[18px]">
            Iniciar sesión
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignUp}
          className="p-3 bg-blue-500 rounded-full mt-6"
        >
          <Text className="text-white text-center text-[18px]">
            Registrarse
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
