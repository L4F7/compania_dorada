import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Text,
  TextInput,
  View
} from 'react-native';

import Button from '../Components/Button';
import { auth } from '../../firebaseConfig';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigation } from '@react-navigation/core';
import { useState } from 'react';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false); // State for loading indicator

  const navigation = useNavigation();

  const validateEmail = () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Correo electrónico inválido');
      return false;
    }
    return true;
  };

  const validatePassword = () => {
    if (password.length < 6) {
      Alert.alert('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    if (password !== confirmPassword) {
      Alert.alert('Las contraseñas no coinciden');
      return false;
    }
    return true;
  };

  const handleSignUp = () => {
    if (!validateEmail()) return;
    if (!validatePassword()) return;
    setLoading(true); 

    createUserWithEmailAndPassword(auth, email, password)
      .then(() => {
        Alert.alert('Usuario creado', 'Inicio de sesión exitoso');
        navigation.replace('tab-navigation');
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        if (errorCode === 'auth/email-already-in-use') {
          Alert.alert('Error', 'El correo electrónico ya está en uso');
        } else {
          Alert.alert('Error', errorMessage);
        }
      })
      .finally(() => {
        setLoading(false);
      });

    
  };

  const handleLogin = () => {
    navigation.replace('Login');
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView>
        <Image
          source={require('./../../assets/images/register.jpg')}
          className="w-full h-[300px] object-cover"
        />
        <View className="p-8 bg-white mt-[-20px] rounded-t-3xl rounded-b-3xl shadow-md flex-1">
          <Text className="text-[30px] font-bold">Compañia Dorada</Text>
          <Text className="text-[18px] text-slate-500">
            Crea una cuenta para empezar a compartir!
          </Text>
          <Text className="text-[18px] text-slate-500">
            - El usuario va a ser tu correo electrónico
          </Text>
          <Text className="text-[18px] text-slate-500">
            - El correo electrónico debe tener un formato válido
            "user@email.com"
          </Text>
          <Text className="text-[18px] text-slate-500">
            - La contraseña debe tener al menos 6 caracteres
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="Correo electrónico"
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
          <TextInput
            value={confirmPassword}
            secureTextEntry={true}
            onChangeText={setConfirmPassword}
            placeholder="Confirmar contraseña"
            textContentType="password"
            className="border-b-2 border-slate-300 mt-6 text-[20px]"
          />
          {/** Sign in and Sign up */}
          <Button
            title={'Registrar cuenta'}
            onPress={handleSignUp}
            bgColor={'blue-500'}
          />
          <Button
            title={'Regresar a iniciar sesión'}
            onPress={handleLogin}
            bgColor={'blue-500'}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
