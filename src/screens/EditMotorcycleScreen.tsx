"use client"

import type React from "react"
import { useEffect, useState } from "react"
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
import { listAreas, type Area } from "../services/areaService"
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native"

type MotorcycleParam = {
  EditMotorcycle: {
    motorcycle: {
      id: string | number
      modelo: string
      placa: string
      areaId?: number
      areaNome?: string
      createdAt?: string
    }
  }
}

export const EditMotorcycleScreen: React.FC = () => {
  const { theme } = useTheme()
  const navigation = useNavigation<any>()
  const route = useRoute<RouteProp<MotorcycleParam, "EditMotorcycle">>()
  const current = route.params?.motorcycle

  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    modelo: current?.modelo ?? "",
    placa: current?.placa ?? "",
    areaId: (current?.areaId as number | undefined) ?? (undefined as unknown as number),
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})

  const [areas, setAreas] = useState<Area[]>([])
  useEffect(() => {
    ;(async () => {
      try {
        const list = await listAreas()
        setAreas(list)
      } catch {
        // segue sem nomes se falhar
      }
    })()
  }, [])

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {}

    if (!formData.modelo.trim()) newErrors.modelo = "Modelo é obrigatório"

    if (!formData.placa.trim()) {
      newErrors.placa = "Placa é obrigatória"
    } else if (!/^[A-Z]{3}[0-9][A-Z0-9][0-9]{2}$/.test(formData.placa.replace(/[^A-Z0-9]/g, ""))) {
      newErrors.placa = "Formato de placa inválido (ex: ABC1234 ou ABC1D23)"
    }

    if (!formData.areaId) newErrors.areaId = "Selecione uma área"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSave = async () => {
    if (!current?.id) {
      Alert.alert("Erro", "Registro inválido para edição.")
      return
    }
    if (!validateForm()) return

    setLoading(true)
    try {
      await motorcycleService.update(current.id, {
        modelo: formData.modelo.trim(),
        placa: formData.placa.trim().toUpperCase(),
        areaId: formData.areaId!,
      })
      Alert.alert("Sucesso", "Moto atualizada com sucesso!", [
        { text: "OK", onPress: () => navigation.goBack() },
      ])
    } catch {
      Alert.alert("Erro", "Não foi possível atualizar a moto. Tente novamente.")
    } finally {
      setLoading(false)
    }
  }

  const formatPlaca = (text: string) => {
    const cleaned = text.replace(/[^A-Z0-9]/g, "").toUpperCase()
    if (cleaned.length <= 3) return cleaned
    if (cleaned.length <= 4) return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    if (cleaned.length <= 7) return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5)}`
    return `${cleaned.slice(0, 3)}-${cleaned.slice(3, 4)}${cleaned.slice(4, 5)}${cleaned.slice(5, 7)}`
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardView}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Editar Moto</Text>
          <View style={styles.placeholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.iconContainer}>
            <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="bicycle" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.iconText, { color: theme.textSecondary }]}>Atualize os dados da sua moto</Text>
          </View>

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
              <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>Selecione a Área *</Text>
              {errors.areaId ? (
                <Text style={{ color: "#d00", marginBottom: 6, fontSize: 12 }}>{errors.areaId}</Text>
              ) : null}

              <View style={styles.suggestionsGrid}>
                {areas.map((a) => {
                  const active = formData.areaId === a.id
                  return (
                    <TouchableOpacity
                      key={a.id}
                      style={[
                        styles.suggestionChip,
                        {
                          backgroundColor: theme.surface,
                          borderColor: theme.border,
                          opacity: active ? 0.9 : 1,
                        },
                      ]}
                      onPress={() => setFormData({ ...formData, areaId: a.id })}
                    >
                      <Text style={[styles.suggestionText, { color: theme.text }]}>{a.nome}</Text>
                    </TouchableOpacity>
                  )
                })}
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <CustomButton title="Salvar alterações" onPress={handleSave} loading={loading} />
              <CustomButton title="Cancelar" onPress={() => navigation.goBack()} variant="outline" />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboardView: { flex: 1 },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 20, paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  placeholder: { width: 40 },
  scrollContent: { padding: 20 },
  iconContainer: { alignItems: "center", marginBottom: 32 },
  iconCircle: {
    width: 96, height: 96, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16,
  },
  iconText: { fontSize: 16, textAlign: "center" },
  form: { gap: 20 },
  suggestionsTitle: { fontSize: 14, marginBottom: 8 },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  suggestionText: { fontSize: 14 },
  buttonContainer: { gap: 12, marginTop: 20 },
})

export default EditMotorcycleScreen
