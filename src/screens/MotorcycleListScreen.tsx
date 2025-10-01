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

interface MotorcycleListScreenProps {
  navigation: any
}

export const MotorcycleListScreen: React.FC<MotorcycleListScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [filteredMotorcycles, setFilteredMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  useFocusEffect(
    useCallback(() => {
      loadMotorcycles()
    }, []),
  )

  useEffect(() => {
    filterMotorcycles()
  }, [motorcycles, searchQuery])

  const loadMotorcycles = async () => {
    try {
      const data = await motorcycleService.getAll()
      setMotorcycles(data.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
    } catch (error) {
      console.error("Error loading motorcycles:", error)
      Alert.alert("Erro", "Não foi possível carregar as motos")
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

    const filtered = motorcycles.filter(
      (motorcycle) =>
        motorcycle.modelo.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motorcycle.placa.toLowerCase().includes(searchQuery.toLowerCase()) ||
        motorcycle.fabricante.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    setFilteredMotorcycles(filtered)
  }

  const handleRefresh = () => {
    setRefreshing(true)
    loadMotorcycles()
  }

  const handleDelete = (motorcycle: Motorcycle) => {
    Alert.alert("Confirmar exclusão", `Deseja excluir a moto ${motorcycle.modelo}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir",
        style: "destructive",
        onPress: async () => {
          try {
            await motorcycleService.delete(motorcycle.id)
            loadMotorcycles()
            Alert.alert("Sucesso", "Moto excluída com sucesso")
          } catch (error) {
            Alert.alert("Erro", "Não foi possível excluir a moto")
          }
        },
      },
    ])
  }

  const handleEdit = (motorcycle: Motorcycle) => {
    navigation.navigate("EditMotorcycle", { motorcycle })
  }

  const renderMotorcycleItem = ({ item }: { item: Motorcycle }) => (
    <View style={[styles.motorcycleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.motorcycleHeader}>
        <View style={[styles.motorcycleIcon, { backgroundColor: `${theme.primary}20` }]}>
          <Ionicons name="bicycle" size={24} color={theme.primary} />
        </View>
        <View style={styles.motorcycleInfo}>
          <Text style={[styles.motorcycleModel, { color: theme.text }]}>{item.modelo}</Text>
          <Text style={[styles.motorcyclePlate, { color: theme.textSecondary }]}>{item.placa}</Text>
          <Text style={[styles.motorcycleBrand, { color: theme.textSecondary }]}>{item.fabricante}</Text>
        </View>
        <View style={styles.motorcycleActions}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.primary}20` }]}
            onPress={() => handleEdit(item)}
          >
            <Ionicons name="pencil" size={16} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: `${theme.error}20` }]}
            onPress={() => handleDelete(item)}
          >
            <Ionicons name="trash" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.motorcycleFooter}>
        <Text style={[styles.motorcycleDate, { color: theme.textSecondary }]}>
          Cadastrada em {new Date(item.createdAt).toLocaleDateString("pt-BR")}
        </Text>
      </View>
    </View>
  )

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <View style={[styles.emptyIcon, { backgroundColor: `${theme.primary}20` }]}>
        <Ionicons name="bicycle" size={48} color={theme.primary} />
      </View>
      <Text style={[styles.emptyTitle, { color: theme.text }]}>
        {searchQuery ? "Nenhuma moto encontrada" : "Nenhuma moto cadastrada"}
      </Text>
      <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
        {searchQuery ? "Tente ajustar sua pesquisa" : "Comece adicionando sua primeira moto"}
      </Text>
      {!searchQuery && (
        <TouchableOpacity
          style={[styles.emptyButton, { backgroundColor: theme.primary }]}
          onPress={() => navigation.navigate("AddMotorcycle")}
        >
          <Text style={styles.emptyButtonText}>Cadastrar Moto</Text>
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
        <Text style={[styles.headerTitle, { color: theme.text }]}>Minhas Motos</Text>
        <TouchableOpacity
          onPress={() => navigation.navigate("AddMotorcycle")}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="add" size={24} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchInputContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar por modelo, placa ou fabricante..."
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
          {filteredMotorcycles.length} {filteredMotorcycles.length === 1 ? "moto encontrada" : "motos encontradas"}
        </Text>
      </View>

      {/* List */}
      <FlatList
        data={filteredMotorcycles}
        renderItem={renderMotorcycleItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
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
