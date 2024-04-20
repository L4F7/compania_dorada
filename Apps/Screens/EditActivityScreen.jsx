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
import { auth, db } from '../../firebaseConfig';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';

import DateTimePicker from '@react-native-community/datetimepicker';
import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useRoute } from '@react-navigation/native';

export default function EditActivityScreen() {

  const { params } = useRoute();  
  const [activity, setActivity] = useState({});

  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);

  const [date, setDate] = useState(null);
  const [time, setTime] = useState(null);

  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);
  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [updating, setUpdating] = useState(false);

  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    if (params) {
      setActivity(params.activity);
      setDate(new Date(params.activity.date));

      const originalDateString = params.activity.date;
      const datePart = originalDateString.split('T')[0];
      const newDateString = `${datePart}T${params.activity.time}.000Z`;

      setTime(new Date(newDateString));
      
      setImage(params.activity.image);
    }

  }, [params]);


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

  const onUpdateMethod = async (value) => {

    if (!validateImage()) return;
    if (!validateDate()) return;
    if (!validateTime()) return;

    // Borrar la imagen anterior y actualizarla con la nueva en el documento

    setUpdating(true);

    // Converts the URI into a Blob file
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `communityPost/${Date.now()}.jpg`);

    // Hacer todo dentro de una transacción
    if(image !== activity.image) {
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      value.image = url;
    }

    if (value.title !== activity.title) {
      activity.title = value.title;
    }

    if (value.description !== activity.description) {
      activity.description = value.description;
    }

    if (value.location !== activity.location) {
      activity.location = value.location;
    }

    if (value.maxParticipants !== activity.maxParticipants) {
      activity.maxParticipants = value.maxParticipants;
    }

    if (value.category !== activity.category) {
      activity.category = value.category;
    }

    if (date !== activity.date) {
      activity.date = date.toISOString().split('T')[0];
    }

    if (time !== activity.time) {
      activity.time = time.toTimeString().split(' ')[0];
    }

    const q = query(collection(db, 'UserPost'), where('id', '==', activity.id));

    const querySnapshot = await getDocs(q);
    
    querySnapshot.forEach((doc) => {

      updateDoc(doc.ref, activity).then(() => {
        Alert.alert('¡Felicidades!', 'Actividad actualizada');
      }).catch((error) => {
        Alert.alert('Error', 'Error al actualizar la actividad');
      });

    });

    setUpdating(false);
    
  };

  const handleDatePickerChange = (event, selectedDate) => {
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

    console.log('------------------------------------------');
    console.log('\nTime:', time);

    let hours = time.split(':')[0];
    let minutes = time.split(':')[1];
    let formatedTime =
      hours > 12 ? `${hours - 12}:${minutes} PM` : `${hours}:${minutes} AM`;
    
    console.log('Formated time:', formatedTime);
    
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

    //console.log('New date:', newDate);

    return `${day} de ${months[month]} del ${year}`;
  };

  return (
    <KeyboardAvoidingView>
      <ScrollView className=" pl-10 pr-10 pb-10 bg-white">
        <Text className="text-[17px] text-gray-500 mb-3">
          Edita los campos que desees cambiar
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
          onSubmit={(value) => onUpdateMethod(value)}
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
              <Text className="text-[20px] font-bold mt-5 pb-2" style={{alignSelf: 'center'}}>Imagen</Text>
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
              <Text className="text-[20px] font-bold mt-5">Titulo</Text>
              <TextInput
                style={styles.input}
                placeholder="Titulo"
                value={activity?.title}
                //onChangeText={handleChange('title')}
              ></TextInput>
              <Text className="text-[20px] font-bold mt-5">Descripción</Text>
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={activity?.description}
                numberOfLines={5}
                onChangeText={handleChange('description')}
              ></TextInput>
              <Text className="text-[20px] font-bold mt-5">Ubicación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={activity?.location}
                onChangeText={handleChange('location')}
              ></TextInput>
              <Text className="text-[20px] font-bold mt-5"> Numero de participantes</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={activity?.maxParticipants?.toString()}
                placeholder="Numero de participantes"
                onChangeText={handleChange('maxParticipants')}
              />
              <Text className="text-[20px] font-bold mt-5">Fecha y hora</Text>
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
                <DateTimePicker
                  value={date || new Date()} // Use state or formik value
                  mode={'date'}
                  timeZoneName={'America/Costa_Rica'}
                  minimumDate={new Date()}
                  onChange={handleDatePickerChange}
                />
              )}

              <TouchableOpacity
                onPress={() => {
                  setIsTimePickerVisible(true);
                }}
                style={styles.input}
                disabled={isDatePickerVisible}
              >
                <Text className="text-[17px]">
                  {time
                    ? formatTime(time.toISOString().split('T')[1])
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

              <Text className="text-[20px] font-bold mt-5">Categoría</Text>
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
              <TouchableOpacity
                onPress={handleSubmit}
                className="p-3 bg-blue-500 rounded-full mt-5 mb-14"
                style={{ backgroundColor: updating ? '#ccc' : '#007BFF' }}
                disabled={updating}
              >
                {updating ? (
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
