import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  ToastAndroid,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { app } from '../../firebaseConfig';
import { Picker } from '@react-native-picker/picker';
import { getDocs, getFirestore, collection, addDoc } from 'firebase/firestore';
import * as ImagePicker from 'expo-image-picker';
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';
import { useUser } from '@clerk/clerk-expo';

export default function AddActivity() {
  const [categoryList, setCategoryList] = useState([]);
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const db = getFirestore(app);
  const storage = getStorage();
  const { user } = useUser();

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

  const onSubmitMethod = async (value) => {
    setUploading(true);

    // Converts the URI into a Blob file
    const response = await fetch(image);
    const blob = await response.blob();
    const storageRef = ref(storage, `communityPost/${Date.now()}.jpg`);

    uploadBytes(storageRef, blob)
      .then((snapshot) => {
        console.log('Uploaded a blob or file!');
      })
      .then((_response) => {
        getDownloadURL(storageRef).then(async (downloadUrl) => {
          value.image = downloadUrl;
          value.userName = user.fullName;
          value.userEmail = user.primaryEmailAddress.emailAddress;
          value.userImage = user.imageUrl;

          const docRef = await addDoc(collection(db, 'UserPost'), value);
          if (docRef.id) {
            setUploading(false);
            Alert.alert('Actividad agregada exitosamente');
          }
        });
      });
  };

  return (
    <View className="p-10">
      <Text className="text-[27px] font-bold mt-5">Agregar Actividad</Text>
      <Text className="text-[17px] text-gray-500 mb-3">
        Llena los campos para agregar una actividad
      </Text>
      <Formik
        initialValues={{
          title: '',
          description: '',
          category: '',
          // date: '',
          // time: '',
          location: '',
          image: '',
          userName: '',
          userEmail: '',
        }}
        onSubmit={(value) => onSubmitMethod(value)}
        // validate={(values) => {
        //   const errors = {};
        //   if (!values.title) {
        //     ToastAndroid.show('Titulo no presente', ToastAndroid.SHORT);
        //     errors.title = 'Requerido';
        //   }
        //   if (!values.description) {
        //     ToastAndroid.show('Descripción no presente', ToastAndroid.SHORT);
        //     errors.description = 'Requerido';
        //   }
        //   if (!values.category) {
        //     ToastAndroid.show('Categoría no presente', ToastAndroid.SHORT);
        //     errors.category = 'Requerido';
        //   }
        //   if (!values.location) {
        //     ToastAndroid.show('Ubicación no presente', ToastAndroid.SHORT);
        //     errors.location = 'Requerido';
        //   }
        //   return errors;
        // }}
      >
        {({
          handleChange,
          handleBlur,
          handleSubmit,
          setFieldValue,
          values,
          //errors,
        }) => (
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
            <TextInput
              style={styles.input}
              placeholder="Titulo"
              value={values?.title}
              onChangeText={handleChange('title')}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Descripción"
              value={values?.description}
              numberOfLines={5}
              onChangeText={handleChange('description')}
            ></TextInput>
            <TextInput
              style={styles.input}
              placeholder="Ubicación"
              value={values?.location}
              onChangeText={handleChange('location')}
            ></TextInput>
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
              className="p-3 bg-blue-500 rounded-full mt-20"
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
    </View>
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
