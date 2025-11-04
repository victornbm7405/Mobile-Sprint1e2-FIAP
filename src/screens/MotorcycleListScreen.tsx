// src/screens/MotorcycleListScreen.tsx
"use client"

import type React from "react"
import { useState, useEffect, useCallback } from "react"
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  TouchableOpacity,
  Alert,
  RefreshControl,
  TextInput,
} from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { motorcycleService } from "../services/motorcycleService"
import type { Motorcycle } from "../types/motorcycle"
import { useFocusEffect } from "@react-navigation/native"
import { listAreas, type Area } from "../services/areaService"
import { useTranslation } from "react-i18next"

interface MotorcycleListScreenProps {
  navigation: any
}

export const MotorcycleListScreen: React.FC<MotorcycleListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const { t, i18n } = useTranslation()
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Áreas para resolver nome pela id
  const [areas, setAreas] = useState<Area[]>([])
  const areaName = useCallback(
    (id?: number) => {
      if (id == null) return ""
      const a = areas.find((x) => x.id === id)
      return a?.nome ?? String(id)
    },
    [areas],
  )

  // Carrega as áreas 1x
  useEffect(() => {
    ;(async () => {
      try {
        const a = await listAreas()
        setAreas(a)
      } catch {
        // segue com fallback para o id
      }
    })()
  }, [])

  useFocusEffect(
    useCallback(() => {
      loadMotorcycles()
    }, []),
  )

  useEffect(() => {
    filterMotorcycles()
  }, [motorcycles, searchQuery, areas])

  const loadMotorcycles = async () => {
    try {
      const data = await motorcycleService.getAll()
      setMotorcycles(
        data.sort(
          (a: any, b: any) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
        ),
      )
    } catch (error) {
      console.error("Error loading motorcycles:", error)
      Alert.alert(
        t("motorcycleList.alert.loadErrorTitle", { defaultValue: "Erro" }),
        t("motorcycleList.alert.loadErrorMessage", { defaultValue: "Não foi possível carregar as motos" })
      )
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const filterMotorcycles = () => {
    if (!searchQuery.trim()) {
      setFilteredMotorcycles(motorcycles)
      return
    }

    const q = searchQuery.toLowerCase()
    const filtered = motorcycles.filter((motorcycle: any) => {
      const modelo = (motorcycle.modelo ?? "").toLowerCase()
      const placa = (motorcycle.placa ?? "").toLowerCase()
      const aNome = areaName(motorcycle.areaId).toLowerCase()
      return modelo.includes(q) || placa.includes(q) || aNome.includes(q)
    })
    setFilteredMotorcycles(filtered)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadMotorcycles()
  }

  const handleDelete = (motorcycle: Motorcycle) => {
    Alert.alert(
      t("motorcycleList.alert.deleteTitle", { defaultValue: "Confirmar exclusão" }),
      t("motorcycleList.alert.deleteMessage", {
        defaultValue: "Deseja excluir a moto {{model}}?",
        model: (motorcycle as any).modelo,
      }),
      [
        { text: t("common.cancel", { defaultValue: "Cancelar" }), style: "cancel" },
        {
          text: t("common.delete", { defaultValue: "Excluir" }),
          style: "destructive",
          onPress: async () => {
            try {
              await motorcycleService.delete((motorcycle as any).id)
              loadMotorcycles()
              Alert.alert(
                t("common.success", { defaultValue: "Sucesso" }),
                t("motorcycleList.alert.deleteSuccess", { defaultValue: "Moto excluída com sucesso" }),
              )
            } catch (error) {
              Alert.alert(
                t("common.error", { defaultValue: "Erro" }),
                t("motorcycleList.alert.deleteFail", { defaultValue: "Não foi possível excluir a moto" }),
              )
            }
          },
        },
      ],
    )
  }

  const handleEdit = (motorcycle: Motorcycle) => {
    navigation.navigate("EditMotorcycle", { motorcycle })
  }

  const renderMotorcycleItem = ({ item }: { item: any }) => {
    // locale amigável conforme idioma atual
    const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR"
    const dateText = item.createdAt
      ? new Date(item.createdAt).toLocaleDateString(locale)
      : ""

    return (
      <View
        style={[
          styles.motorcycleCard,
          { backgroundColor: theme.surface, borderColor: theme.border },
        ]}
      >
        <View style={styles.motorcycleHeader}>
          <View
            style={[
              styles.motorcycleIcon,
              { backgroundColor: `${theme.primary}20` },
            ]}
          >
            <Ionicons name="bicycle" size={24} color={theme.primary} />
          </View>
          <View style={styles.motorcycleInfo}>
            <Text style={[styles.motorcycleModel, { color: theme.text }]}>
              {item.modelo}
            </Text>
            <Text
              style={[styles.motorcyclePlate, { color: theme.textSecondary }]}
            >
              {item.placa}
            </Text>
            {/* Exibe NOME da área (ou id se não encontrado) no lugar do fabricante */}
            <Text
              style={[styles.motorcycleBrand, { color: theme.textSecondary }]}
            >
              {areaName(item.areaId)}
            </Text>
          </View>
          <View style={styles.motorcycleActions}>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: `${theme.primary}20` },
              ]}
              onPress={() => handleEdit(item)}
            >
              <Ionicons name="pencil" size={16} color={theme.primary} />
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.actionButton,
                { backgroundColor: `${theme.error}20` },
              ]}
              onPress={() => handleDelete(item)}
            >
              <Ionicons name="trash" size={16} color={theme.error} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.motorcycleFooter}>
          <Text style={[styles.motorcycleDate, { color: theme.textSecondary }]}>
            {t("motorcycleList.registeredAt", {
              defaultValue: "Cadastrada em {{date}}",
              date: dateText,
            })}
          </Text>
        </View>
      </View>
    )
  }

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View
        style={[styles.emptyIcon, { backgroundColor: `${theme.primary}20` }]}
      >
        <Ionicons name="bicycle" size={48} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {searchQuery
          ? t("motorcycleList.empty.titleNotFound", { defaultValue: "Nenhuma moto encontrada" })
          : t("motorcycleList.empty.titleNone", { defaultValue: "Nenhuma moto cadastrada" })}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery
          ? t("motorcycleList.empty.subtitleNotFound", { defaultValue: "Tente ajustar sua pesquisa" })
          : t("motorcycleList.empty.subtitleNone", { defaultValue: "Comece adicionando sua primeira moto" })}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("AddMotorcycle")}
        >
          <Text style={styles.emptyButtonText}>
            {t("motorcycleList.actions.add", { defaultValue: "Cadastrar Moto" })}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  )

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>
          {t("motorcycleList.title", { defaultValue: "Minhas Motos" })}
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddMotorcycle")}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View
          style={[
            styles.searchInputContainer,
            { backgroundColor: theme.surface, borderColor: theme.border },
          ]}
        >
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder={t("motorcycleList.search.placeholder", {
              defaultValue: "Buscar por modelo, placa ou área...",
            })}
            placeholderTextColor={theme.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsContainer}>
        <Text style={[styles.statsText, { color: theme.textSecondary }]}>
          {t("motorcycleList.stats", {
            count: filteredMotorcycles.length,
            defaultValue:
              "{{count}} motos encontradas",
          })}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredMotorcycles}
        renderItem={renderMotorcycleItem}
        keyExtractor={(item: any) => String(item.id)}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  statsContainer: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statsText: {
    fontSize: 14,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  motorcycleCard: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginBottom: 12,
  },
  motorcycleHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  motorcycleIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  motorcycleInfo: {
    flex: 1,
  },
  motorcycleModel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 2,
  },
  motorcyclePlate: {
    fontSize: 14,
    marginBottom: 2,
  },
  motorcycleBrand: {
    fontSize: 14,
  },
  motorcycleActions: {
    flexDirection: "row",
    gap: 8,
  },
  actionButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  motorcycleFooter: {
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  motorcycleDate: {
    fontSize: 12,
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 48,
  },
  emptyIcon: {
    width: 96,
    height: 96,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 24,
  },
  emptyButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  emptyButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
})
