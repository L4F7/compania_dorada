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
import { collection, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { deleteObject, getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useEffect, useState } from 'react';

import { Formik } from 'formik';
import { Picker } from '@react-native-picker/picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../../firebaseConfig';
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

      console.log('Date:', date);
      console.log('Time:', time);
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

  const deleteFromStorage = async () => {
    const storageRef = ref(getStorage(), `communityPost/${activity.createdAt + activity.userEmail}.jpg`);
    deleteObject(storageRef)
      .then(() => {
        console.log('Image successfully deleted!');
      })
      .catch((error) => {
        console.log('Error deleting image: ', error);
      });
  }

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
    const storageRef = ref(storage, `communityPost/${params.activity.createdAt + params.activity.userEmail}.jpg`);

    // Hacer todo dentro de una transacción
    if (image !== activity.image) {
      await deleteFromStorage();
      await uploadBytes(storageRef, blob);
      const url = await getDownloadURL(storageRef);
      activity.image = url;
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
      updateDoc(doc.ref, activity)
        .then(() => {
          Alert.alert('¡Felicidades!', 'Actividad actualizada');
        })
        .catch((error) => {
          Alert.alert('Error', 'Error al actualizar la actividad');
        }).finally(() => {
          setUpdating(false);
        });
    });
  };

  const handleDatePickerChange = (event, selectedDate) => {
    selectedDate.setDate(selectedDate.getDate() - 1);
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
      <ScrollView className=" pl-10 pr-10 pb-10 bg-white">
        <Text className="text-[17px] text-gray-500 mb-3">
          Edita los campos que desees cambiar
        </Text>
        <Formik
          initialValues={{
            id: '',
            title: params?.activity?.title,
            description: params?.activity?.description,
            category: params?.activity?.category,
            location: params?.activity?.location,
            image: '',
            userEmail: params?.activity?.userEmail,
            createdAt: params?.activity?.createdAt,
            maxParticipants: params?.activity?.maxParticipants.toString(),
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
              <Text className="text-[20px] font-bold mt-3">Titulo</Text>
              <TextInput
                style={styles.input}
                placeholder="Titulo"
                value={values?.title}
                multiline = {true}
                numberOfLines = {2}
                onChangeText={handleChange('title')}
              ></TextInput>

              {/** Description section --------------------------------------------------------------------------------------*/}
              <Text className="text-[20px] font-bold mt-3">Descripción</Text>
              <TextInput
                style={styles.input}
                placeholder="Descripción"
                value={values?.description}
                multiline = {true}
                numberOfLines = {4}
                onChangeText={handleChange('description')}
              ></TextInput>

              {/** Location section -----------------------------------------------------------------------------------------*/}
              <Text className="text-[20px] font-bold mt-3">Ubicación</Text>
              <TextInput
                style={styles.input}
                placeholder="Ubicación"
                value={values?.location}
                multiline = {true}
                numberOfLines = {2}
                onChangeText={handleChange('location')}
              ></TextInput>

              {/** Max participants section ---------------------------------------------------------------------------------*/}
              <Text className="text-[20px] font-bold mt-3">Número de participantes</Text>
              <TextInput
                style={styles.input}
                keyboardType="numeric"
                value={values?.maxParticipants.toString()}
                placeholder="Numero de participantes"
                onChangeText={handleChange('maxParticipants')}
              />
              
              {/** Date and time section ------------------------------------------------------------------------------------*/}
              <Text className="text-[20px] font-bold mt-3">Fecha y hora</Text>

              {/** Date picker section ------------------------------------------------------------*/}
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

              {/** Time picker section ------------------------------------------------------------*/}
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
              <Text className="text-[20px] font-bold mt-3">Categoría</Text>
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
                className="bg-blue-500 p-4 rounded-full mt-5 mb-14"
                style={{ backgroundColor: updating ? '#ccc' : '#3b82f6' }}
                disabled={updating}
              >
                {updating ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-white font-bold text-center text-[18px]">
                    Actualizar
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
