import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { getData, saveData } from '../storage/storage';
import { v4 as uuidv4 } from 'uuid';
import styles from '../styles/mottuTheme';
import Header from '../components/Header';

export default function MotoFormScreen({ navigation }: any) {
  const [modelo, setModelo] = useState('');
  const [placa, setPlaca] = useState('');

  const handleSave = async () => {
    const novaMoto = { id: uuidv4(), modelo, placa };
    const motos = (await getData('motos')) || [];
    await saveData('motos', [...motos, novaMoto]);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Cadastrar Moto</Text>
      <TextInput
        style={styles.input}
        placeholder="Modelo"
        value={modelo}
        onChangeText={setModelo}
      />
      <TextInput
        style={styles.input}
        placeholder="Placa"
        value={placa}
        onChangeText={setPlaca}
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>
    </View>
  );
}
