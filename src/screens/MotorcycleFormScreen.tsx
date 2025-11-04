// src/screens/MotorcycleFormScreen.tsx
"use client";

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
import { createMotorcycle, updateMotorcycle } from "../services/motorcycleService";
import { useTranslation } from "react-i18next";
import { useTheme } from "../contexts/ThemeContext";

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
  const { t } = useTranslation();
  const { theme } = useTheme();

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
        // opcional:
        // Alert.alert(t("motorcycleForm.alert.errorTitle", { defaultValue: "Erro" }),
        //             t("motorcycleForm.alert.areasLoadFailed", { defaultValue: "Não foi possível carregar áreas" }));
      }
    })();
  }, []);

  async function onSave() {
    // Mantém as mesmas validações que você já tinha; apenas exigimos área:
    if (!form.placa?.trim() || !form.modelo?.trim() || !form.areaId) {
      Alert.alert(
        t("motorcycleForm.alert.requiredTitle", { defaultValue: "Campos obrigatórios" }),
        t("motorcycleForm.alert.requiredMessage", {
          defaultValue: "Informe Placa, Modelo e Área.",
        })
      );
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
      Alert.alert(
        t("motorcycleForm.alert.errorTitle", { defaultValue: "Erro" }),
        e?.message ?? t("motorcycleForm.alert.saveFailed", { defaultValue: "Falha ao salvar" })
      );
    }
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.form}>
        {/* --- CAMPO PLACA (inalterado) --- */}
        <Text style={styles.label}>
          {t("motorcycleForm.fields.plate.label", { defaultValue: "Placa *" })}
        </Text>
        <TextInput
          value={form.placa}
          onChangeText={(t1) => setForm((f) => ({ ...f, placa: t1 }))}
          placeholder={t("motorcycleForm.fields.plate.placeholder", { defaultValue: "ABC1D23" })}
          style={styles.input}
        />

        {/* --- CAMPO MODELO (inalterado) --- */}
        <Text style={styles.label}>
          {t("motorcycleForm.fields.model.label", { defaultValue: "Modelo *" })}
        </Text>
        <TextInput
          value={form.modelo}
          onChangeText={(t2) => setForm((f) => ({ ...f, modelo: t2 }))}
          placeholder={t("motorcycleForm.fields.model.placeholder", { defaultValue: "CG 160" })}
          style={styles.input}
        />

        {/* --- CAMPO ANO (se você já tinha, mantemos) --- */}
        <Text style={styles.label}>
          {t("motorcycleForm.fields.year.label", { defaultValue: "Ano" })}
        </Text>
        <TextInput
          value={form.ano ? String(form.ano) : ""}
          onChangeText={(t3) => setForm((f) => ({ ...f, ano: t3 ? Number(t3) : undefined }))}
          placeholder={t("motorcycleForm.fields.year.placeholder", { defaultValue: "2022" })}
          keyboardType="numeric"
          style={styles.input}
        />

        {/* >>>>> AQUI ENTRA O QUE SUBSTITUI “FABRICANTES POPULARES” <<<<< */}
        <Text style={styles.label}>
          {t("motorcycleForm.fields.areas.label", { defaultValue: "Áreas *" })}
        </Text>
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
                <Text style={[styles.pillText, active && styles.pillTextActive]}>{item.nome}</Text>
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingVertical: 6 }}
          style={{ marginBottom: 12 }}
          showsHorizontalScrollIndicator={false}
        />

        <TouchableOpacity style={styles.save} onPress={onSave}>
          <Text style={styles.saveText}>
            {t("motorcycleForm.actions.save", { defaultValue: "Salvar" })}
          </Text>
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
