import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { removeData } from '../storage/storage';
import styles from '../styles/mottuTheme';
import Header from '../components/Header';

export default function SettingsScreen({ navigation }: any) {
  const handleClearData = async () => {
    await removeData('motos');
    await removeData('patio');
    navigation.navigate('Home');
  };

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Configurações</Text>
      <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleClearData}>
        <Text style={styles.buttonText}>Limpar Dados e Resetar</Text>
      </TouchableOpacity>
    </View>
  );
}
