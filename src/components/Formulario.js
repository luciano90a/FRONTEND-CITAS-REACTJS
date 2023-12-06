// rafce
import React, { useState, useEffect } from 'react';
import {
  Modal,
  Text,
  StyleSheet,
  SafeAreaView,
  View,
  TextInput,
  ScrollView,
  Pressable,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import DatePicker from 'react-native-date-picker';
import axios from 'axios'; // No necesitas importar Axios como { Axios }

import { URL } from '../helpers/index';
const endpoint = URL;

const Formulario = (props) => {
  const [name, setPaciente] = useState('');
  const [id, setId] = useState('');
  const [owner, setOwner] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [symptom, setSymptom] = useState('');
  const [date, setDate] = useState(new Date());
  const [users, setUsers] = useState([]);
  const [isPickerEnabled, setIsPickerEnabled] = useState(false);

  const { modalVisible, pacientes, setPacientes, setModalVisible, paciente: pacienteObj, setPaciente: setPacienteApp, pacienteAgregado } = props;

  useEffect(() => {
    getUsers();
  }, []);

  useEffect(() => {
    if (Object.keys(pacienteObj).length > 0) {
      setId(pacienteObj.id);
      setPaciente(pacienteObj.name);
      setOwner(pacienteObj.user.id);
      setEmail(pacienteObj.email);
      setPhone(pacienteObj.phone);
      setSymptom(pacienteObj.symptom);
      //setDate( pacienteObj.date);
    }
  }, [pacienteObj]);

  const getUsers = async () => {
    try {
      const response = await axios.get(`${endpoint}users`);
      setUsers(response.data);
      setIsPickerEnabled(true);
    } catch (error) {
      console.log(error);
      setIsPickerEnabled(false);
    }
  };

  const store = async (newPatient) => {
    try {
      const response_ = await axios.post(endpoint + 'appointment', {
        name: newPatient.name,
        owner: newPatient.owner,
        email: newPatient.email,
        phone: newPatient.phone,
        symptom: newPatient.symptom,
        date: newPatient.date,
      });
      console.log(response_);
    } catch (error) {
      Alert.alert('Error', 'Server error.', [
        { text: 'Recordar después', style: 'cancel' },
        { text: 'Cancelar' },
        { text: 'Ok' },
      ]);
    }
  };

  const handleCita =  () => {
    if (![name, owner, email, date, symptom].every((field) => field)) {
      Alert.alert('Error', 'Todos los campos son obligatorios.', [
        { text: 'Recordar después', style: 'cancel' },
        { text: 'Cancelar' },
        { text: 'Ok' },
      ]);
      return;
    }
  
    const newPatient = {
      name,
      owner,
      email,
      phone,
      date:date.toISOString,
      symptom,
    };
  
    if (id) {
      newPatient.id = id;
      const pacientesActualizados = pacientes.map((pacienteState) =>
        pacienteState.id === newPatient.id ? newPatient : pacienteState
      );
      setPacientes(pacientesActualizados);
      console.log(newPatient.name);
      console.log(newPatient.owner);
      console.log(newPatient.email);
      console.log(newPatient.phone);
      console.log(newPatient.date);
      console.log(newPatient.symptom);
      
      try {
        console.log("el try");
        console.log(id);
        const response = axios.put(`http://192.168.56.1:8000/api/amigo/${id}`, newPatient);
        console.log(response);
      } catch (error) {
        Alert.alert('Error', 'Error del servidor.', [
          { text: 'Recordar después', style: 'cancel' },
          { text: 'Cancelar' },
          { text: 'Ok' },
        ]);
      }
  
      setPacienteApp({});
    } else {
      store(newPatient);
    }
  
    setModalVisible(!modalVisible);
    setId('');
    setPaciente('');
    setOwner('');
    setEmail('');
    setPhone('');
    setDate(new Date());
    setSymptom('');
    pacienteAgregado();
  };
  

  return (
    <Modal animationType="slide" visible={modalVisible}>
      <SafeAreaView style={styles.contenido}>
        <ScrollView>
          <Text style={styles.titulo}>
            {pacienteObj.id ? 'Editar' : 'Nueva'}{' '}
            <Text style={styles.tituloBold}>Cita</Text>
          </Text>

          <Pressable
            style={styles.btnCancelar}
            onPress={() => {
              setModalVisible(!modalVisible);
              setPacienteApp({});
              setId('');
              setPaciente('');
              setOwner('');
              setEmail('');
              setPhone('');
              setDate(new Date());
              setSymptom('');
            }}
          >
            <Text style={styles.btnCancelarTexto}> Cancelar accion</Text>
          </Pressable>

          <View style={styles.campo}>
            <Text style={styles.label}>Nombre Paciente</Text>
            <TextInput
              style={styles.input}
              placeholder="Nombre Paciente"
              placeholderTextColor={'#666'}
              value={name}
              onChangeText={setPaciente}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Propietario</Text>

            <Picker
              style={styles.input}
              selectedValue={owner}
              enabled={isPickerEnabled}
              onValueChange={(itemValue, itemIndex) => {
                setOwner(itemValue);
              }}
            >
              {users?.map((user) => (
                <Picker.Item key={user.id} label={user.name} value={user.id} />
              ))}
            </Picker>
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Email</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingrese correo electrónico"
              placeholderTextColor={'#666'}
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Telefono</Text>
            <TextInput
              style={styles.input}
              placeholder="Telefono"
              placeholderTextColor={'#666'}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              maxLength={12}
            />
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Fecha Alta</Text>
            <View style={styles.fechaContenedor}>
              <DatePicker date={date} locale="es" onDateChange={(date) => setDate(date)} />
            </View>
          </View>

          <View style={styles.campo}>
            <Text style={styles.label}>Sintomas</Text>
            <TextInput
              style={styles.input}
              placeholder="Sintomas paciente"
              placeholderTextColor={'#666'}
              keyboardType="text"
              value={symptom}
              onChangeText={setSymptom}
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <Pressable style={styles.btnNuevaCita} onPress={handleCita}>
            <Text style={styles.btnNuevaCitaTexto}>
              {pacienteObj.id ? 'Editar' : 'Agregara'}
            </Text>
          </Pressable>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  contenido: {
    backgroundColor: '#6D28D9',
    flex: 1,
  },
  titulo: {
    fontSize: 30,
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 30,
    color: '#FFF',
  },
  tituloBold: {
    fontWeight: '900',
  },
  btnCancelar: {
    marginVertical: 30,
    backgroundColor: '#5827A4',
    marginHorizontal: 30,
    padding: 15,
    borderRadius: 10,
  },
  btnCancelarTexto: {
    color: '#FFF',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  campo: {
    marginTop: 10,
    marginHorizontal: 30,
  },
  label: {
    color: '#FFF',
    marginBottom: 10,
    marginTop: 15,
    fontSize: 20,
    fontWeight: '600',
  },
  input: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 10,
  },
  sintomasInput: {
    height: 100,
  },
  fechaContenedor: {
    backgroundColor: '#FFF',
    borderRadius: 10,
  },
  btnNuevaCita: {
    marginVertical: 50,
    backgroundColor: '#F59E0B',
    paddingVertical: 15,
    marginHorizontal: 30,
    borderRadius: 10,
  },
  btnNuevaCitaTexto: {
    color: '#5827A4',
    textAlign: 'center',
    fontWeight: '900',
    fontSize: 16,
    textTransform: 'uppercase',
  },
});

export default Formulario;

