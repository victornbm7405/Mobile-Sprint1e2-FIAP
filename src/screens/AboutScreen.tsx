"use client";

import React from "react";
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { useTranslation } from "react-i18next";

interface AboutScreenProps {
  navigation: any;
}

const AboutScreen: React.FC<AboutScreenProps> = ({ navigation }) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("settings.about.title", { defaultValue: "Sobre o App" })}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={[styles.content, { backgroundColor: theme.background }]}>
        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.title, { color: theme.text }]}>
            {t("app.name", { defaultValue: "Motorcycle Manager" })}
          </Text>
          <Text style={[styles.version, { color: theme.textSecondary }]}>
            {t("settings.version", { defaultValue: "v1.0.0" })}
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            {t("settings.about.message", {
              defaultValue:
                "Aplicativo para gerenciar suas motocicletas de forma simples e eficiente.\n\nDesenvolvido com React Native.",
            })}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Text style={[styles.subtitle, { color: theme.text }]}>
            {t("settings.about.creditsTitle", { defaultValue: "Créditos" })}
          </Text>
          <Text style={[styles.paragraph, { color: theme.textSecondary }]}>
            {t("settings.about.creditsBody", {
              defaultValue:
                "Este app foi desenvolvido para fins educacionais. Ícones por Ionicons. React Native + Expo.",
            })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  content: { padding: 20, gap: 16 },
  card: { borderWidth: 1, borderRadius: 16, padding: 16 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 4 },
  version: { fontSize: 14, marginBottom: 12 },
  subtitle: { fontSize: 16, fontWeight: "700", marginBottom: 8 },
  paragraph: { fontSize: 14, lineHeight: 20 },
});

export default AboutScreen;
