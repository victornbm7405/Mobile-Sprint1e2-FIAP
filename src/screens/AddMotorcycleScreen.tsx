"use client"

import type React from "react"
import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { motorcycleService } from "../services/motorcycleService"
import { CustomButton } from "../components/CustomButton"
import { CustomInput } from "../components/CustomInput"

interface AddMotorcycleScreenProps {
  navigation: any
}

export const AddMotorcycleScreen: React.FC<AddMotorcycleScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    modelo: "",
    placa: "",
    fabricante: "",
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.modelo.trim()) {
      newErrors.modelo = "Modelo é obrigatório"
    }

    if (!formData.placa.trim()) {
      newErrors.placa = "Placa é obrigatória"
    } else if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(formData.placa.replace(/[^A-Z0-9]/g, ""))) {
      newErrors.placa = "Formato de placa inválido (ex: ABC1234 ou ABC1D23)"
    }

    if (!formData.fabricante.trim()) {
      newErrors.fabricante = "Fabricante é obrigatório"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async () => {
    if (!validateForm()) return

    setLoading(true)
    try {
      await motorcycleService.save({
        modelo: formData.modelo.trim(),
        placa: formData.placa.trim().toUpperCase(),
        fabricante: formData.fabricante.trim(),
      })

      Alert.alert("Sucesso", "Moto cadastrada com sucesso!", [
        {
          text: "OK",
          onPress: () => navigation.goBack(),
        },
      ])
    } catch (error) {
      Alert.alert("Erro", "Não foi possível cadastrar a moto. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatPlaca = (text: string) => {
    // Remove caracteres não alfanuméricos e converte para maiúsculo
    const cleaned = text.replace(/[^A-Z0-9]/g, "").toUpperCase()

    // Aplica formatação ABC1234 ou ABC1D23
    if (cleaned.length <= 3) {
      return cleaned
    } else if (cleaned.length <= 4) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    } else if (cleaned.length <= 7) {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5)}`
    } else {
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5, 7)}`
    }
  }

  const popularFabricantes = [
    "Honda",
    "Yamaha",
    "Suzuki",
    "Kawasaki",
    "BMW",
    "Ducati",
    "Harley-Davidson",
    "Triumph",
    "KTM",
    "Aprilia",
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Cadastrar Moto</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="bicycle" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.iconText, { color: theme.textSecondary }]}>Preencha os dados da sua moto</Text>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <CustomInput
              label="Modelo"
              value={formData.modelo}
              onChangeText={(text) => setFormData({ ...formData, modelo: text })}
              placeholder="Ex: CB 600F Hornet"
              error={errors.modelo}
            />

            <CustomInput
              label="Placa"
              value={formData.placa}
              onChangeText={(text) => setFormData({ ...formData, placa: formatPlaca(text) })}
              placeholder="ABC-1234"
              error={errors.placa}
            />

            <View>
              <CustomInput
                label="Fabricante"
                value={formData.fabricante}
                onChangeText={(text) => setFormData({ ...formData, fabricante: text })}
                placeholder="Ex: Honda"
                error={errors.fabricante}
              />

              {/* Fabricantes populares */}
              <View style={styles.suggestionsContainer}>
                <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>Fabricantes populares:</Text>
                <View style={styles.suggestionsGrid}>
                  {popularFabricantes.map((fabricante) => (
                    <TouchableOpacity
                      key={fabricante}
                      style={[
                        styles.suggestionChip,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, fabricante })}
                    >
                      <Text style={[styles.suggestionText, { color: theme.text }]}>{fabricante}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton title="Cadastrar Moto" onPress={handleSubmit} loading={loading} />
              <CustomButton title="Cancelar" onPress={() => navigation.goBack()} variant="outline" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  placeholder: {
    width: 40,
  },
  scrollContent: {
    padding: 20,
  },
  iconContainer: {
    alignItems: "center",
    marginBottom: 32,
  },
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: {
    fontSize: 16,
    textAlign: "center",
  },
  form: {
    gap: 20,
  },
  suggestionsContainer: {
    marginTop: 12,
  },
  suggestionsTitle: {
    fontSize: 14,
    marginBottom: 8,
  },
  suggestionsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  suggestionChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  suggestionText: {
    fontSize: 14,
  },
  buttonContainer: {
    gap: 12,
    marginTop: 20,
  },
})
