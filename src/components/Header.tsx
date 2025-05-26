import React from 'react';
import { View, Image } from 'react-native';
import styles from '../styles/mottuTheme';

export default function Header() {
  return (
    <View style={{ backgroundColor: '#121212', padding: 8, justifyContent: 'center', alignItems: 'center' }}>
      <Image 
        source={require('../../assets/Mottu.jpg')} 
        style={[styles.logo, { opacity: 0.9 }]} // Ajuste de transparência para mesclar com o fundo
      />
    </View>
  );
}
