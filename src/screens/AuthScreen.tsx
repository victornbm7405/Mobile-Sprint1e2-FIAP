"use client";

import type React from "react";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { useTheme } from "../contexts/ThemeContext";
import { useAuth } from "../contexts/AuthContext";
import { CustomButton } from "../components/CustomButton";
import { CustomInput } from "../components/CustomInput";
import { useTranslation } from "react-i18next";

export const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth(); // API do backend via AuthContext
  const { t } = useTranslation();

  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // username/senha (o backend espera isso)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = t("auth.errors.usernameRequired", {
        defaultValue: "Usuário é obrigatório",
      });
    }

    if (!formData.password) {
      newErrors.password = t("auth.errors.passwordRequired", {
        defaultValue: "Senha é obrigatória",
      });
    } else if (formData.password.length < 3) {
      newErrors.password = t("auth.errors.passwordMin", {
        defaultValue: "Senha deve ter pelo menos 3 caracteres",
      });
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t("auth.errors.passwordMismatch", {
        defaultValue: "Senhas não coincidem",
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      if (isLogin) {
        await login(formData.username, formData.password);
      } else {
        // Sem endpoint de cadastro no backend neste momento
        Alert.alert(
          t("auth.alert.warnTitle", { defaultValue: "Aviso" }),
          t("auth.alert.signupDisabled", {
            defaultValue: "Cadastro desativado no momento. Use a opção de login.",
          })
        );
      }
    } catch (error: any) {
      Alert.alert(
        t("auth.alert.errorTitle", { defaultValue: "Erro" }),
        error?.message ||
          t("auth.alert.genericError", { defaultValue: "Não foi possível entrar" })
      );
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setFormData({ username: "", password: "", confirmPassword: "" });
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <View style={[styles.logoContainer, { backgroundColor: theme.primary }]}>
              <Text style={styles.logoText}>M</Text>
            </View>
            <Text style={[styles.title, { color: theme.text }]}>
              {isLogin
                ? t("auth.title.login", { defaultValue: "Bem-vindo de volta" })
                : t("auth.title.register", { defaultValue: "Criar conta" })}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {isLogin
                ? t("auth.subtitle.login", {
                    defaultValue: "Faça login para gerenciar suas motos",
                  })
                : t("auth.subtitle.register", {
                    defaultValue: "Cadastre-se para começar a gerenciar suas motos",
                  })}
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label={t("auth.username.label", { defaultValue: "Usuário" })}
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder={t("auth.username.placeholder", { defaultValue: "admin" })}
              error={errors.username}
            />

            <CustomInput
              label={t("auth.password.label", { defaultValue: "Senha" })}
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder={t("auth.password.placeholder", { defaultValue: "Sua senha" })}
              secureTextEntry
              error={errors.password}
            />

            {!isLogin && (
              <CustomInput
                label={t("auth.confirmPassword.label", { defaultValue: "Confirmar Senha" })}
                value={formData.confirmPassword}
                onChangeText={(text) =>
                  setFormData({ ...formData, confirmPassword: text })
                }
                placeholder={t("auth.confirmPassword.placeholder", {
                  defaultValue: "Confirme sua senha",
                })}
                secureTextEntry
                error={errors.confirmPassword}
              />
            )}

            <CustomButton
              title={
                isLogin
                  ? t("auth.buttons.login", { defaultValue: "Entrar" })
                  : t("auth.buttons.register", { defaultValue: "Cadastrar" })
              }
              onPress={handleSubmit}
              loading={loading}
            />

            <CustomButton
              title={
                isLogin
                  ? t("auth.buttons.toRegister", {
                      defaultValue: "Não tem conta? Cadastre-se",
                    })
                  : t("auth.buttons.toLogin", {
                      defaultValue: "Já tem conta? Faça login",
                    })
              }
              onPress={toggleMode}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ⚠️ CSS inalterado
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 48,
  },
  logoContainer: {
    width: 80,
    height: 80,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  logoText: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  form: {
    gap: 16,
  },
});
