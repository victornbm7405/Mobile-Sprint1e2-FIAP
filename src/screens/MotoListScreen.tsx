import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity } from 'react-native';
import { getData } from '../storage/storage';
import styles from '../styles/mottuTheme';
import Header from '../components/Header';

type Moto = {
  id: string;
  modelo: string;
  placa: string;
};

export default function MotoListScreen({ navigation }: any) {
  const [motos, setMotos] = useState<Moto[]>([]);

  useEffect(() => {
    const loadMotos = async () => {
      const saved = await getData('motos');
      if (saved) setMotos(saved);
    };
    const unsubscribe = navigation.addListener('focus', loadMotos);
    return unsubscribe;
  }, [navigation]);

  return (
    <View style={styles.container}>
      <Header />
      <Text style={styles.title}>Lista de Motos</Text>
      <FlatList
        data={motos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => navigation.navigate('MotoDetail', { moto: item })}>
            <View style={styles.listItem}>
              <Text style={styles.listText}>{item.modelo} - {item.placa}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('MotoForm')}>
        <Text style={styles.buttonText}>Cadastrar Nova Moto</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Settings')}>
        <Text style={styles.buttonText}>Configurações</Text>
      </TouchableOpacity>
    </View>
  );
}
