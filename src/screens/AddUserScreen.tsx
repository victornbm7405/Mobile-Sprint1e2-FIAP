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
import { userService } from "../services/userService";
import { useNavigation } from "@react-navigation/native";
import { useTranslation } from "react-i18next";

const AddUserScreen: React.FC = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const nav = useNavigation<any>();
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<"User" | "Admin">("User");

  const [form, setForm] = useState({
    nome: "",
    email: "",
    username: "",
    senha: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.nome.trim()) e.nome = t("userAdd.errors.nameRequired", { defaultValue: "Nome é obrigatório" });
    if (!form.email.trim()) e.email = t("userAdd.errors.emailRequired", { defaultValue: "Email é obrigatório" });
    else if (!/\S+@\S+\.\S+/.test(form.email))
      e.email = t("userAdd.errors.emailInvalid", { defaultValue: "Email inválido" });
    if (!form.username.trim())
      e.username = t("userAdd.errors.usernameRequired", { defaultValue: "Username é obrigatório" });
    if (!form.senha.trim() || form.senha.length < 6)
      e.senha = t("userAdd.errors.passwordMin", { defaultValue: "Senha deve ter 6+ caracteres" });
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await userService.create({ ...form, senha: form.senha, role });
      Alert.alert(
        t("userAdd.alert.successTitle", { defaultValue: "Sucesso" }),
        t("userAdd.alert.successMessage", { defaultValue: "Usuário criado!" }),
        [{ text: "OK", onPress: () => nav.goBack() }]
      );
    } catch (err: any) {
      Alert.alert(
        t("userAdd.alert.errorTitle", { defaultValue: "Erro" }),
        err?.message ?? t("userAdd.alert.errorMessage", { defaultValue: "Falha ao criar usuário" })
      );
    } finally {
      setLoading(false);
    }
  };

  const roleLabel = (r: "User" | "Admin") => t(`userAdd.roles.${r}`, { defaultValue: r });

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboard}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => nav.goBack()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={theme.text} />
          </TouchableOpacity>
          <Text style={[styles.headerTitle, { color: theme.text }]}>
            {t("userAdd.title", { defaultValue: "Cadastrar Usuário" })}
          </Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          {/* Icon */}
          <View style={styles.iconWrap}>
            <View style={[styles.iconCircle, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="person-add" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.iconText, { color: theme.textSecondary }]}>
              {t("userAdd.subtitle", { defaultValue: "Preencha os dados do usuário" })}
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label={t("userAdd.name.label", { defaultValue: "Nome" })}
              value={form.nome}
              onChangeText={(v) => setForm({ ...form, nome: v })}
              placeholder={t("userAdd.name.placeholder", { defaultValue: "Nome completo" })}
              error={errors.nome}
            />

            <CustomInput
              label={t("userAdd.email.label", { defaultValue: "Email" })}
              value={form.email}
              onChangeText={(v) => setForm({ ...form, email: v })}
              placeholder={t("userAdd.email.placeholder", { defaultValue: "user@email.com" })}
              keyboardType="email-address"
              error={errors.email}
            />

            <CustomInput
              label={t("userAdd.username.label", { defaultValue: "Username" })}
              value={form.username}
              onChangeText={(v) => setForm({ ...form, username: v })}
              placeholder={t("userAdd.username.placeholder", { defaultValue: "victor" })}
              error={errors.username}
            />

            <CustomInput
              label={t("userAdd.password.label", { defaultValue: "Senha" })}
              value={form.senha}
              onChangeText={(v) => setForm({ ...form, senha: v })}
              placeholder={t("userAdd.password.placeholder", { defaultValue: "mín. 6 caracteres" })}
              secureTextEntry
              error={errors.senha}
            />

            {/* role chips */}
            <Text style={[styles.suggestionsTitle, { color: theme.textSecondary }]}>
              {t("userAdd.role.label", { defaultValue: "Perfil *" })}
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
                title={t("userAdd.submit", { defaultValue: "Cadastrar" })}
                onPress={submit}
                loading={loading}
              />
              <CustomButton
                title={t("userAdd.cancel", { defaultValue: "Cancelar" })}
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
  iconCircle: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  iconText: { fontSize: 16, textAlign: "center" },
  form: { gap: 20 },
  suggestionsTitle: { fontSize: 14, marginBottom: 8 },
  suggestionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  suggestionChip: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16, borderWidth: 1 },
  suggestionText: { fontSize: 14 },
  buttons: { gap: 12, marginTop: 20 },
});

export default AddUserScreen;
