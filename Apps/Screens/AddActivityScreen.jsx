import * as Crypto from 'expo-crypto';
import * as ImagePicker from 'expo-image-picker';

import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { auth, db } from '../../firebaseConfig';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';

import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

export default function AddActivity() {
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [uploading, setUploading] = useState(false);

  const user = auth.currentUser;
  const storage = getStorage();

  const getCategoryList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Category'));
      const newCategoryList = querySnapshot.docs.map((doc) => doc.data());
      setCategoryList(newCategoryList);
    } catch (error) {
      console.error('Error fetching category list:', error);
    }
  };

  useEffect(() => {
    getCategoryList();
  }, []);

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const validateImage = () => {
    if (!image) {
      Alert.alert('Error', 'Imagen no seleccionada');
      return false;
    }
    return true;
  };

  const validateDate = () => {
    if (!date) {
      Alert.alert('Error', 'Fecha no seleccionada');
      return false;
    }
    return true;
  };

  const validateTime = () => {
    if (!time) {
      Alert.alert('Error', 'Hora no seleccionada');
      return false;
    }
    return true;
  };

  const onSubmitMethod = async (value, resetForm) => {
    if (!validateImage()) return;
    if (!validateDate()) return;
    if (!validateTime()) return;

    setUploading(true);

    const creationDate = new Date().toISOString();

    // Converts the URI into a Blob file
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `communityPost/${creationDate+user.email}.jpg`);

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!');
      })
      .then((_response) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          value.image = downloadUrl;
          value.userEmail = user.email;
          value.createdAt = creationDate;
          value.date = date.toISOString().split('T')[0];
          value.time = time.toTimeString().split(' ')[0];
          value.maxParticipants = parseInt(value.maxParticipants);
          value.currentParticipants = parseInt(0);
          value.id = Crypto.randomUUID();

          const docRef = await addDoc(collection(db, 'UserPost'), value);
          if (docRef.id) {
            setUploading(false);
            Alert.alert('Actividad agregada exitosamente');
            resetForm();
            setImage(null);
            setDate(null);
            setTime(null);
          } else {
            setUploading(false);
            Alert.alert('Error al agregar actividad');
          }
        });
      })
      .catch((error) => {
        setUploading(false);
        Alert.alert('Error al subir imagen');
      });
  };

  const handleDatePickerChange = (event, selectedDate) => {
    selectedDate.setDate(selectedDate.getDate());
    const currentDate = selectedDate || date;
    setIsDatePickerVisible(false);
    setDate(currentDate);
  };

  const handleTimePickerChange = (event, selectedTime) => {
    const currentTime = selectedTime || time;
    setIsTimePickerVisible(false);
    setTime(currentTime);
  };

  const formatTime = (time) => {

    let hours = time.split(':')[0];
    let minutes = time.split(':')[1];
    let formatedTime =
      hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
      
    return formatedTime;
  };

  const formatDate = (date) => {
    
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

    return `${day} de ${months[month]} del ${year}`;
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className="p-10 bg-white">
        <Text className="text-[27px] font-bold mt-5">Agregar Actividad</Text>
        <Text className="text-[17px] text-gray-500 mb-3">
          Llena los campos para agregar una actividad
        </Text>
        <Formik
          initialValues={{
            id: '',
            title: '',
            description: '',
            category: '',
            location: '',
            image: '',
            userEmail: '',
            createdAt: '',
            maxParticipants: '',
            currentParticipants: '',
          }}
          onSubmit={(value, { resetForm }) => onSubmitMethod(value, resetForm)}
          validateOnBlur={false}
          validateOnChange={false}
          validateOnMount={false}
          validate={(values) => {
            const errors = {};
            if (!values.title) {
              Alert.alert('Error', 'El titulo es requerido');
              errors.title = 'Requerido';
            } else if (!values.description) {
              Alert.alert('Error', 'La descripción es requerida');
              errors.description = 'Requerido';
            } else if (!values.location) {
              Alert.alert('Error', 'La ubicación es requerida');
              errors.location = 'Requerido';
            } else if (!values.maxParticipants) {
              Alert.alert('Error', 'El número de participantes es requerido');
              errors.maxParticipants = 'Requerido';
            } else if (!values.category) {
              Alert.alert('Error', 'La categoría es requerida');
              errors.category = 'Requerido';
            }
            return errors;
          }}
        >
          {({ handleChange, handleSubmit, setFieldValue, values }) => (
            <View>
              <TouchableOpacity onPress={pickImage}>
                {image ? (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />
                ) : (
                  <Image
                    source={require('../../assets/images/image_placeholder.jpg')}
                    style={{
                      width: 150,
                      height: 150,
                      borderRadius: 10,
                      alignSelf: 'center',
                    }}
                  />
                )}
              </TouchableOpacity>

              {/** Title section --------------------------------------------------------------------------------------------*/}
              <TextInput
                style={styles.input}
                placeholder="Titulo"
                value={values?.title}
                multiline = {true}
                numberOfLines = {1}
                onChangeText={handleChange('title')}
              ></TextInput>

              {/** Description section --------------------------------------------------------------------------------------*/}
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={values?.description}
                multiline = {true}
                numberOfLines = {4}
                onChangeText={handleChange('description')}
              ></TextInput>

              {/** Location section -----------------------------------------------------------------------------------------*/}
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={values?.location}
                multiline = {true}
                numberOfLines = {1}
                onChangeText={handleChange('location')}
              ></TextInput>

              {/** Max participants section ---------------------------------------------------------------------------------*/}
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={values?.maxParticipants.toString()}
                placeholder="Número de participantes"
                onChangeText={handleChange('maxParticipants')}
              />

              {/** Date picker section --------------------------------------------------------------------------------------*/}
              <TouchableOpacity
                onPress={() => {
                  setIsDatePickerVisible(true);
                }}
                style={styles.input}
                disabled={isTimePickerVisible}
              >
                <Text className="text-[17px]">
                  {date
                    ? formatDate(date.toISOString().split('T')[0])
                    : 'Seleccionar fecha'}
                </Text>
              </TouchableOpacity>

              {isDatePickerVisible && (
                <RNDateTimePicker
                  value={date || new Date()} // Use state or formik value
                  mode={'date'}
                  timeZoneName={'America/Costa_Rica'}
                  minimumDate={new Date()}
                  onChange={handleDatePickerChange}
                />
              )}

              {/** Time picker section --------------------------------------------------------------------------------------*/}
              <TouchableOpacity
                onPress={() => {
                  setIsTimePickerVisible(true);
                }}
                style={styles.input}
                disabled={isDatePickerVisible}
              >
                <Text className="text-[17px]">
                  {time
                    ? formatTime(time.toTimeString().split(' ')[0])
                    : 'Seleccionar hora'}
                </Text>
              </TouchableOpacity>

              {isTimePickerVisible && (
                <RNDateTimePicker
                  value={time || new Date()} // Use state or formik value
                  mode={'time'}
                  timeZoneName={'America/Costa_Rica'}
                  is24Hour={true} // Optional: Set to true for 24-hour format
                  onChange={handleTimePickerChange}
                />
              )}

              {/** Category picker section -----------------------------------------------------------------------------------*/}
              <View style={{ borderWidth: 1, borderRadius: 10, marginTop: 15 }}>
                <Picker
                  selectedValue={values?.category}
                  className="border-2"
                  onValueChange={(itemValue) =>
                    setFieldValue('category', itemValue)
                  }
                >
                  {categoryList.length > 0 &&
                    categoryList?.map((item, index) => (
                      <Picker.Item
                        key={index}
                        label={item?.name}
                        value={item?.name}
                      />
                    ))}
                </Picker>
              </View>

              {/** Submit button section ------------------------------------------------------------------------------------*/}
              <TouchableOpacity
                onPress={handleSubmit}
                className="p-3 bg-blue-500 rounded-full mt-5 mb-14"
                style={{ backgroundColor: uploading ? '#ccc' : '#007BFF' }}
                disabled={uploading}
              >
                {uploading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white text-center text-[18px]">
                    Agregar
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          )}
        </Formik>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    marginBottom: 5,
    paddingHorizontal: 17,
    fontSize: 17,
  },
});
