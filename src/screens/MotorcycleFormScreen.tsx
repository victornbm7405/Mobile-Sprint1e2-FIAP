// src/screens/MotorcycleFormScreen.tsx
import type React from "react";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  FlatList,
} from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import type { Area } from "../services/areaService";
import { listAreas } from "../services/areaService";

// NOTE: mantenha seus serviços existentes de criar/atualizar moto.
// Aqui estão nomes genéricos; use os seus se diferente:
import { createMotorcycle, updateMotorcycle } from "../services/motorcycleService";

// Se você já tem um tipo Motorcycle, mantenha-o.
// Precisamos apenas garantir que exista areaId na entidade.
type Motorcycle = {
  id: number;
  placa: string;
  modelo: string;
  ano?: number;
  areaId: number;
  areaNome?: string;
};

type ParamList = { MotorcycleForm: { id?: number } };
type R = RouteProp<ParamList, "MotorcycleForm">;

export default function MotorcycleFormScreen() {
  const route = useRoute<R>();
  const navigation = useNavigation<any>();

  const editingId = route.params?.id;
  const [areas, setAreas] = useState<Area[]>([]);
  const [form, setForm] = useState<Partial<Motorcycle>>({
    placa: "",
    modelo: "",
    ano: undefined,
    areaId: undefined as unknown as number,
  });

  useEffect(() => {
    (async () => {
      try {
        const a = await listAreas();
        setAreas(a);
      } catch (e) {
        // opcional: Alert.alert("Erro", "Não foi possível carregar áreas");
      }
    })();
  }, []);

  async function onSave() {
    // Mantém as mesmas validações que você já tinha; apenas exigimos área:
    if (!form.placa?.trim() || !form.modelo?.trim() || !form.areaId) {
      Alert.alert("Campos obrigatórios", "Informe Placa, Modelo e Área.");
      return;
    }
    try {
      if (editingId) {
        await updateMotorcycle(editingId, {
          placa: form.placa!.trim(),
          modelo: form.modelo!.trim(),
          ano: form.ano,
          areaId: form.areaId!,
        });
      } else {
        await createMotorcycle({
          id: 0,
          placa: form.placa!.trim(),
          modelo: form.modelo!.trim(),
          ano: form.ano,
          areaId: form.areaId!,
        } as any);
      }
      navigation.goBack();
    } catch (e: any) {
      Alert.alert("Erro", e?.message ?? "Falha ao salvar");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.form}>
        {/* --- CAMPO PLACA (inalterado) --- */}
        <Text style={styles.label}>Placa *</Text>
        <TextInput
          value={form.placa}
          onChangeText={(t) => setForm((f) => ({ ...f, placa: t }))}
          placeholder="ABC1D23"
          style={styles.input}
        />

        {/* --- CAMPO MODELO (inalterado) --- */}
        <Text style={styles.label}>Modelo *</Text>
        <TextInput
          value={form.modelo}
          onChangeText={(t) => setForm((f) => ({ ...f, modelo: t }))}
          placeholder="CG 160"
          style={styles.input}
        />

        {/* --- CAMPO ANO (se você já tinha, mantemos) --- */}
        <Text style={styles.label}>Ano</Text>
        <TextInput
          value={form.ano ? String(form.ano) : ""}
          onChangeText={(t) =>
            setForm((f) => ({ ...f, ano: t ? Number(t) : undefined }))
          }
          placeholder="2022"
          keyboardType="numeric"
          style={styles.input}
        />

        {/* >>>>> AQUI ENTRA O QUE SUBSTITUI “FABRICANTES POPULARES” <<<<< */}
        <Text style={styles.label}>Áreas *</Text>
        <FlatList
          horizontal
          data={areas}
          keyExtractor={(a) => String(a.id)}
          ItemSeparatorComponent={() => <View style={{ width: 8 }} />}
          renderItem={({ item }) => {
            const active = form.areaId === item.id;
            return (
              <TouchableOpacity
                onPress={() => setForm((f) => ({ ...f, areaId: item.id }))}
                style={[styles.pill, active && styles.pillActive]}
              >
                <Text
                  style={[styles.pillText, active && styles.pillTextActive]}
                >
                  {item.nome}
                </Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingVertical: 6 }}
          style={{ marginBottom: 12 }}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.save} onPress={onSave}>
          <Text style={styles.saveText}>Salvar</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

/**
 * Mantenha seus estilos originais.
 * Os nomes abaixo são exemplos comuns para casar com o que já existe no seu projeto.
 * Se os seus nomes forem outros, só troque as referências acima.
 */
const styles = StyleSheet.create({
  container: { flex: 1 },
  form: { padding: 12, gap: 10 },
  label: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  pill: {
    borderWidth: 1,
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pillActive: { backgroundColor: "#e6f5ef" },
  pillText: { fontSize: 12 },
  pillTextActive: { fontWeight: "700" },
  save: {
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
  },
  saveText: { fontWeight: "700" },
});
