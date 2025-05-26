import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { getData, saveData } from '../storage/storage';
import styles from '../styles/mottuTheme';
import Header from '../components/Header';

export default function MotoDetailScreen({ route, navigation }: any) {
  const { moto } = route.params;

  const handleDelete = async () => {
    const motos = (await getData('motos')) || [];
    const updated = motos.filter((m: any) => m.id !== moto.id);
    await saveData('motos', updated);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Detalhes da Moto</Text>
      <Text style={styles.listText}>Modelo: {moto.modelo}</Text>
      <Text style={styles.listText}>Placa: {moto.placa}</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDelete}>
        <Text style={styles.buttonText}>Excluir Moto</Text>
      </TouchableOpacity>
    </View>
  );
}
