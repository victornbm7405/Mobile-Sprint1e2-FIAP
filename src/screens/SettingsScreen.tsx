// src/screens/SettingsScreen.tsx
"use client"

import type React from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Switch, Alert } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"

// ⬇️ Switch de idioma
import LanguageSwitcher from "../components/LanguageSwitcher"

// ⬇️ i18n
import { useTranslation } from "react-i18next"

interface SettingsScreenProps {
  navigation: any
}

export const SettingsScreen: React.FC<SettingsScreenProps> = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme()
  const { user, logout } = useAuth()
  const { t } = useTranslation() // 🔧 removido i18n (não é mais usado)

  const handleLogout = () => {
    Alert.alert(
      t("settings.logout.confirmTitle", { defaultValue: "Confirmar saída" }),
      t("settings.logout.confirmMessage", { defaultValue: "Deseja realmente sair da sua conta?" }),
      [
        { text: t("common.cancel", { defaultValue: "Cancelar" }), style: "cancel" },
        {
          text: t("settings.logout.confirmButton", { defaultValue: "Sair" }),
          style: "destructive",
          onPress: logout,
        },
      ],
    )
  }

  // Opções de preferências (textos internacionalizados)
  const settingsOptions = [
    {
      title: t("settings.darkTheme.title", { defaultValue: "Tema Escuro" }),
      subtitle: t("settings.darkTheme.subtitle", { defaultValue: "Alternar entre tema claro e escuro" }),
      icon: "moon" as const,
      type: "switch" as const,
      value: isDark,
      onPress: toggleTheme,
    },
    {
      title: t("settings.about.title", { defaultValue: "Sobre o App" }),
      subtitle: t("settings.about.subtitle", { defaultValue: "Informações sobre o aplicativo" }),
      icon: "information-circle" as const,
      type: "navigation" as const,
      onPress: () => {
        Alert.alert(
          t("settings.about.title", { defaultValue: "Sobre o App" }),
          t("settings.about.message", {
            defaultValue:
              "Motorcycle Manager v1.0.0\n\nAplicativo para gerenciar suas motocicletas de forma simples e eficiente.\n\nDesenvolvido com React Native e Firebase.",
          }),
        )
      },
    },
    {
      title: t("settings.help.title", { defaultValue: "Ajuda" }),
      subtitle: t("settings.help.subtitle", { defaultValue: "Dúvidas e suporte" }),
      icon: "help-circle" as const,
      type: "navigation" as const,
      onPress: () => {
        Alert.alert(
          t("settings.help.title", { defaultValue: "Ajuda" }),
          t("settings.help.message", {
            defaultValue:
              "Para suporte, entre em contato:\n\n• Email: suporte@motorcyclemanager.com\n• Telefone: (11) 99999-9999\n\nHorário de atendimento:\nSegunda a Sexta, 9h às 18h",
          }),
        )
      },
    },
  ]

  const accountOptions = [
    {
      title: t("settings.account.logout.title", { defaultValue: "Sair da Conta" }),
      subtitle: t("settings.account.logout.subtitle", { defaultValue: "Fazer logout do aplicativo" }),
      icon: "log-out" as const,
      type: "danger" as const,
      onPress: handleLogout,
    },
  ]

  const renderSettingItem = (item: any, index: number) => (
    <TouchableOpacity
      key={index}
      style={[
        styles.settingItem,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
      ]}
      onPress={item.type !== "switch" ? item.onPress : undefined}
      disabled={item.type === "switch"}
    >
      <View style={styles.settingLeft}>
        <View
          style={[
            styles.settingIcon,
            {
              backgroundColor: item.type === "danger" ? `${theme.error}20` : `${theme.primary}20`,
            },
          ]}
        >
          <Ionicons name={item.icon} size={20} color={item.type === "danger" ? theme.error : theme.primary} />
        </View>
        <View style={styles.settingText}>
          <Text
            style={[
              styles.settingTitle,
              {
                color: item.type === "danger" ? theme.error : theme.text,
              },
            ]}
          >
            {item.title}
          </Text>
          <Text style={[styles.settingSubtitle, { color: theme.textSecondary }]}>{item.subtitle}</Text>
        </View>
      </View>
      <View style={styles.settingRight}>
        {item.type === "switch" ? (
          <Switch
            value={item.value}
            onValueChange={item.onPress}
            trackColor={{ false: theme.border, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        ) : (
          <Ionicons name="chevron-forward" size={20} color={theme.textSecondary} />
        )}
      </View>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("settings.title", { defaultValue: "Configurações" })}
        </Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* User Info */}
        <View style={[styles.userCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <View style={[styles.userAvatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.userAvatarText}>{user?.email?.charAt(0).toUpperCase() || "U"}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.userEmail, { color: theme.text }]}>{user?.email}</Text>
            <Text style={[styles.userStatus, { color: theme.textSecondary }]}>
              {t("settings.user.active", { defaultValue: "Conta ativa" })}
            </Text>
          </View>
        </View>

        {/* Idioma */}
        <View className="language-section" style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("settings.section.language", { defaultValue: "Idioma" })}
          </Text>
          <View style={[styles.sectionContent, { flexDirection: "row", alignItems: "center" }]}>
            <LanguageSwitcher />
          </View>
        </View>

        {/* (🔧 Removido bloco de Debug de Idioma) */}

        {/* Settings Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("settings.section.preferences", { defaultValue: "Preferências" })}
          </Text>
          <View style={styles.sectionContent}>{settingsOptions.map((item, index) => renderSettingItem(item, index))}</View>
        </View>

        {/* Account Section */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            {t("settings.section.account", { defaultValue: "Conta" })}
          </Text>
          <View style={styles.sectionContent}>{accountOptions.map((item, index) => renderSettingItem(item, index))}</View>
        </View>

        {/* App Version */}
        <View style={styles.versionContainer}>
          <Text style={[styles.versionText, { color: theme.textSecondary }]}>
            {t("settings.version", { defaultValue: "Motorcycle Manager v1.0.0" })}
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: { width: 40, height: 40, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  placeholder: { width: 40 },
  scrollContent: { padding: 20 },
  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 32,
  },
  userAvatar: { width: 56, height: 56, borderRadius: 16, alignItems: "center", justifyContent: "center", marginRight: 16 },
  userAvatarText: { fontSize: 20, fontWeight: "bold", color: "#FFFFFF" },
  userInfo: { flex: 1 },
  userEmail: { fontSize: 16, fontWeight: "600", marginBottom: 4 },
  userStatus: { fontSize: 14 },
  section: { marginBottom: 32 },
  sectionTitle: { fontSize: 18, fontWeight: "600", marginBottom: 16 },
  sectionContent: { gap: 12 },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  settingLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  settingIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center", marginRight: 12 },
  settingText: { flex: 1 },
  settingTitle: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  settingSubtitle: { fontSize: 14 },
  settingRight: { marginLeft: 12 },
  versionContainer: { alignItems: "center", paddingVertical: 20 },
  versionText: { fontSize: 14 },
})

export default SettingsScreen
