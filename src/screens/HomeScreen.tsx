import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { saveData, getData } from '../storage/storage';
import styles from '../styles/mottuTheme';
import Header from '../components/Header';

export default function HomeScreen({ navigation }: any) {
  const [patio, setPatio] = useState('');

  useEffect(() => {
    const loadPatio = async () => {
      const savedPatio = await getData('patio');
      if (savedPatio) setPatio(savedPatio);
    };
    loadPatio();
  }, []);

  const handleSavePatio = async () => {
    await saveData('patio', patio);
    navigation.navigate('MotoList');
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Selecione o Pátio:</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite o nome do pátio"
        value={patio}
        onChangeText={setPatio}
      />
      <TouchableOpacity style={styles.button} onPress={handleSavePatio}>
        <Text style={styles.buttonText}>Salvar e Ir para Motos</Text>
      </TouchableOpacity>
    </View>
  );
}