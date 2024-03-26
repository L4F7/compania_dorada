import {
  View,
  Text,
  Image,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import React, { useEffect } from 'react';
import { auth, storeData, getData } from '../../firebaseConfig';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import Button from '../Components/Button';
import { get } from 'react-native/Libraries/TurboModule/TurboModuleRegistry';

export default function LoginScreen() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const navigation = useNavigation();

  const validatePassword = () => {
    if (password.length < 6) {
      Alert.alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    return true;
  };

  const handleSignUp = () => {
    if (!validatePassword()) return;

    createUserWithEmailAndPassword(auth, email, password).catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
    });
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
            title={'Registrarse'}
            onPress={handleSignUp}
            bgColor={'blue-500'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
