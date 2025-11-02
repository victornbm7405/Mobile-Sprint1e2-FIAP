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

export const AuthScreen: React.FC = () => {
  const { theme } = useTheme();
  const { login } = useAuth(); // <- usamos a API do backend via AuthContext
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);

  // Agora usamos username (o backend espera username/senha)
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.username) {
      newErrors.username = "Usuário é obrigatório";
    }

    if (!formData.password) {
      newErrors.password = "Senha é obrigatória";
    } else if (formData.password.length < 3) {
      // simples, só pra evitar vazio
      newErrors.password = "Senha deve ter pelo menos 3 caracteres";
    }

    if (!isLogin && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Senhas não coincidem";
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
        Alert.alert("Aviso", "Cadastro desativado no momento. Use a opção de login.");
      }
    } catch (error: any) {
      Alert.alert("Erro", error?.message || "Não foi possível entrar");
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
              {isLogin ? "Bem-vindo de volta" : "Criar conta"}
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              {isLogin
                ? "Faça login para gerenciar suas motos"
                : "Cadastre-se para começar a gerenciar suas motos"}
            </Text>
          </View>

          <View style={styles.form}>
            <CustomInput
              label="Usuário"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              placeholder="admin"
              error={errors.username}
            />

            <CustomInput
              label="Senha"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              placeholder="Sua senha"
              secureTextEntry
              error={errors.password}
            />

            {!isLogin && (
              <CustomInput
                label="Confirmar Senha"
                value={formData.confirmPassword}
                onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
                placeholder="Confirme sua senha"
                secureTextEntry
                error={errors.confirmPassword}
              />
            )}

            <CustomButton
              title={isLogin ? "Entrar" : "Cadastrar"}
              onPress={handleSubmit}
              loading={loading}
            />

            <CustomButton
              title={isLogin ? "Não tem conta? Cadastre-se" : "Já tem conta? Faça login"}
              onPress={toggleMode}
              variant="outline"
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

// ⚠️ CSS inalterado:
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
