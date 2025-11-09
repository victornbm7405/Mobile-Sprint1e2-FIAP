import React, { useState } from "react";
import { View, Pressable, Text, StyleSheet, Alert } from "react-native";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const [pending, setPending] = useState<"pt" | "es" | null>(null); // 🔧 en -> es

  async function change(code: "pt" | "es") { // 🔧 en -> es
    try {
      console.log("[i18n] changeLanguage start:", code);
      setPending(code);

      // sanity check: existe bundle pra esse idioma?
      const hasBundle = i18n.hasResourceBundle(code, "translation");
      console.log("[i18n] hasResourceBundle:", code, hasBundle);
      if (!hasBundle) {
        Alert.alert(
          "Tradução ausente",
          `Não há bundle de tradução carregado para "${code}".`
        );
      }

      await i18n.changeLanguage(code);

      console.log("[i18n] changeLanguage done:", i18n.language, i18n.resolvedLanguage);
      Alert.alert(
        "Idioma alterado",
        `Atual: ${i18n.language} (resolvido: ${i18n.resolvedLanguage})`
      );
    } catch (err: any) {
      console.error("[i18n] changeLanguage error:", err);
      Alert.alert("Erro ao trocar idioma", String(err?.message ?? err));
    } finally {
      setPending(null);
    }
  }

  const Btn = ({ code, label }: { code: "pt" | "es"; label: string }) => ( // 🔧 en -> es
    <Pressable
      disabled={pending !== null}
      onPress={() => change(code)}
      style={({ pressed }) => [
        styles.btn,
        { opacity: pressed || pending === code ? 0.6 : 1 },
      ]}
    >
      <Text style={styles.txt}>{label}</Text>
    </Pressable>
  );

  return (
    <View style={styles.row}>
      <Btn code="pt" label="Português" />
      <Btn code="es" label="Español" /> {/* 🔧 English -> Español */}
      <Text style={styles.lang}>({i18n.language} → {i18n.resolvedLanguage})</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8 },
  btn: {
    borderWidth: 1,
    borderColor: "#bbb",
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 999,
    backgroundColor: "#fff",
  },
  txt: { fontWeight: "600" },
  lang: { marginLeft: 8, color: "#666" },
});
