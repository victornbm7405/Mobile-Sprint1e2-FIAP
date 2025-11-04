"use client";

import type React from "react";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { CustomInput } from "../components/CustomInput";
import { CustomButton } from "../components/CustomButton";
import { userService, type User } from "../services/userService";
import { useRoute, useNavigation, RouteProp } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

type Param = { EditUser: { user: User } };

const EditUserScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const route = useRoute<RouteProp<Param, "EditUser">>();
  const current = route.params?.user;

  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"User" | "Admin">((current?.role as any) === "Admin" ? "Admin" : "User");

  const [form, setForm] = useState({
    nome: current?.nome ?? "",
    email: current?.email ?? "",
    username: current?.username ?? "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = t("userEdit.errors.nameRequired", { defaultValue: "Nome é obrigatório" });
    if (!form.email.trim()) e.email = t("userEdit.errors.emailRequired", { defaultValue: "Email é obrigatório" });
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = t("userEdit.errors.emailInvalid", { defaultValue: "Email inválido" });
    if (!form.username.trim())
      e.username = t("userEdit.errors.usernameRequired", { defaultValue: "Username é obrigatório" });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!current?.id) {
      return Alert.alert(
        t("userEdit.alert.errorTitle", { defaultValue: "Erro" }),
        t("userEdit.alert.invalidRecord", { defaultValue: "Registro inválido" })
      );
    }
    if (!validate()) return;
    setLoading(true);
    try {
      await userService.update(current.id, {
        nome: form.nome,
        email: form.email,
        username: form.username,
        role,
        senha: form.senha ? form.senha : undefined, // só envia se preenchida
      });
      Alert.alert(
        t("userEdit.alert.successTitle", { defaultValue: "Sucesso" }),
        t("userEdit.alert.updated", { defaultValue: "Usuário atualizado!" }),
        [{ text: t("common.ok", { defaultValue: "OK" }), onPress: () => nav.goBack() }]
      );
    } catch (err: any) {
      Alert.alert(
        t("userEdit.alert.errorTitle", { defaultValue: "Erro" }),
        err?.message ?? t("userEdit.alert.updateFailed", { defaultValue: "Falha ao atualizar usuário" })
      );
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = (r: "User" | "Admin") => t(`userEdit.roles.${r}`, { defaultValue: r });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboard}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {t("userEdit.title", { defaultValue: "Editar Usuário" })}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.iconWrap}>
            <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="person-circle" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.iconText, { color: theme.textSecondary }]}>
              {t("userEdit.subtitle", { defaultValue: "Atualize os dados do usuário" })}
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label={t("userEdit.name.label", { defaultValue: "Nome" })}
              value={form.nome}
              onChangeText={(v) => setForm({ ...form, nome: v })}
              placeholder={t("userEdit.name.placeholder", { defaultValue: "Nome completo" })}
              error={errors.nome}
            />
            <CustomInput
              label={t("userEdit.email.label", { defaultValue: "Email" })}
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              placeholder={t("userEdit.email.placeholder", { defaultValue: "user@email.com" })}
              keyboardType="email-address"
              error={errors.email}
            />
            <CustomInput
              label={t("userEdit.username.label", { defaultValue: "Username" })}
              value={form.username}
              onChangeText={(v) => setForm({ ...form, username: v })}
              placeholder={t("userEdit.username.placeholder", { defaultValue: "victor" })}
              error={errors.username}
            />
            <CustomInput
              label={t("userEdit.password.label", { defaultValue: "Senha (opcional)" })}
              value={form.senha}
              onChangeText={(v) => setForm({ ...form, senha: v })}
              placeholder={t("userEdit.password.placeholder", {
                defaultValue: "deixe em branco para não alterar",
              })}
              secureTextEntry
            />

            <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>
              {t("userEdit.role.label", { defaultValue: "Perfil *" })}
            </Text>
            <View style={styles.suggestionsGrid}>
              {(["User", "Admin"] as const).map((r) => (
                <TouchableOpacity
                  key={r}
                  style={[
                    styles.suggestionChip,
                    { backgroundColor: theme.surface, borderColor: theme.border, opacity: role === r ? 0.9 : 1 },
                  ]}
                  onPress={() => setRole(r)}
                >
                  <Text style={[styles.suggestionText, { color: theme.text }]}>{roleLabel(r)}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.buttons}>
              <CustomButton
                title={t("userEdit.buttons.save", { defaultValue: "Salvar alterações" })}
                onPress={submit}
                loading={loading}
              />
              <CustomButton
                title={t("common.cancel", { defaultValue: "Cancelar" })}
                onPress={() => nav.goBack()}
                variant="outline"
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  keyboard: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { padding: 20 },
  iconWrap: { alignItems: "center", marginBottom: 32 },
  iconCircle: { width: 96, height: 96, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 16 },
  iconText: { fontSize: 16, textAlign: "center" },
  form: { gap: 20 },
  suggestionsTitle: { fontSize: 14, marginBottom: 8 },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  suggestionText: { fontSize: 14 },
  buttons: { gap: 12, marginTop: 20 },
});

export default EditUserScreen;
