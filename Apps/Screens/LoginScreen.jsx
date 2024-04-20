import {
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { auth, getData, storeData } from '../../firebaseConfig';
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';

import Button from '../Components/Button';
import { useEffect } from 'react';
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.replace('Register');
  };

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        Alert.alert('Error', 'Usuario o contraseña incorrectos');
      });
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await storeData(JSON.stringify(user.email));
        console.log(await getData());
        navigation.replace('tab-navigation');
      } else {
        console.log('No user is signed in');
      }
    });
    return unsubscribe;
  }, []);

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Image
          source={require('./../../assets/images/login.jpg')}
          className="w-full h-[300px] object-cover"
        />
        <View className="p-8 bg-white mt-[-20px] rounded-t-3xl rounded-b-3xl shadow-md flex-1">
          <Text className="text-[30px] font-bold">Compañia Dorada</Text>
          <Text className="text-[18px] text-slate-500">
            Actividades para compartir y conocer nuevas personas
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
            keyboardType="email-address"
            textContentType="emailAddress"
            className="border-b-2 border-slate-300 mt-6 text-[20px]"
          />
          <TextInput
            value={password}
            secureTextEntry={true}
            onChangeText={setPassword}
            placeholder="Contraseña"
            textContentType="password"
            className="border-b-2 border-slate-300 mt-6 text-[20px]"
          />
          {/** Sign in and Sign up */}
          <Button
            title={'Iniciar sesión'}
            onPress={handleLogin}
            bgColor={'blue-500'}
          />
          <Button
            title={'Crear cuenta'}
            onPress={handleSignUp}
            bgColor={'blue-500'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
