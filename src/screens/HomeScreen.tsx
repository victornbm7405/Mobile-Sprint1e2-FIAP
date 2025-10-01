"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useTheme } from "../contexts/ThemeContext"
import { useAuth } from "../contexts/AuthContext"
import { motorcycleService } from "../services/motorcycleService"
import type { Motorcycle } from "../types/motorcycle"

interface HomeScreenProps {
  navigation: any
}

export const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const { theme } = useTheme()
  const { user, logout } = useAuth()
  const [motorcycles, setMotorcycles] = useState<Motorcycle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadMotorcycles()
  }, [])

  const loadMotorcycles = async () => {
    try {
      const data = await motorcycleService.getAll()
      setMotorcycles(data)
    } catch (error) {
      console.error("Error loading motorcycles:", error)
    } finally {
      setLoading(false)
    }
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Bom dia"
    if (hour < 18) return "Boa tarde"
    return "Boa noite"
  }

  const quickActions = [
    {
      title: "Cadastrar Moto",
      subtitle: "Adicionar nova moto",
      icon: "add-circle" as const,
      color: theme.primary,
      onPress: () => navigation.navigate("AddMotorcycle"),
    },
    {
      title: "Minhas Motos",
      subtitle: "Ver todas as motos",
      icon: "list" as const,
      color: theme.secondary,
      onPress: () => navigation.navigate("MotorcycleList"),
    },
    {
      title: "Configurações",
      subtitle: "Personalizar app",
      icon: "settings" as const,
      color: theme.textSecondary,
      onPress: () => navigation.navigate("Settings"),
    },
  ]

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: theme.textSecondary }]}>{getGreeting()}</Text>
            <Text style={[styles.userName, { color: theme.text }]}>{user?.email?.split("@")[0] || "Usuário"}</Text>
          </View>
          <TouchableOpacity onPress={logout} style={[styles.logoutButton, { backgroundColor: theme.surface }]}>
            <Ionicons name="log-out-outline" size={24} color={theme.text} />
          </TouchableOpacity>
        </View>

        {/* Stats Cards */}
        <View style={styles.statsContainer}>
          <View style={[styles.statCard, { backgroundColor: theme.primary }]}>
            <Text style={styles.statNumber}>{motorcycles.length}</Text>
            <Text style={styles.statLabel}>Motos Cadastradas</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: theme.surface, borderColor: theme.border }]}>
            <Text style={[styles.statNumber, { color: theme.text }]}>
              {motorcycles.filter((m) => m.fabricante).length}
            </Text>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Fabricantes</Text>
          </View>
        </View>

        {/* Quick Actions */}
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Ações Rápidas</Text>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                style={[styles.actionCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                onPress={action.onPress}
              >
                <View style={[styles.actionIcon, { backgroundColor: `${action.color}20` }]}>
                  <Ionicons name={action.icon} size={24} color={action.color} />
                </View>
                <Text style={[styles.actionTitle, { color: theme.text }]}>{action.title}</Text>
                <Text style={[styles.actionSubtitle, { color: theme.textSecondary }]}>{action.subtitle}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Recent Motorcycles */}
        {motorcycles.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: theme.text }]}>Motos Recentes</Text>
              <TouchableOpacity onPress={() => navigation.navigate("MotorcycleList")}>
                <Text style={[styles.seeAllText, { color: theme.primary }]}>Ver todas</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.motorcyclesList}>
              {motorcycles.slice(0, 3).map((motorcycle) => (
                <View
                  key={motorcycle.id}
                  style={[styles.motorcycleCard, { backgroundColor: theme.surface, borderColor: theme.border }]}
                >
                  <View style={[styles.motorcycleIcon, { backgroundColor: `${theme.primary}20` }]}>
                    <Ionicons name="bicycle" size={20} color={theme.primary} />
                  </View>
                  <View style={styles.motorcycleInfo}>
                    <Text style={[styles.motorcycleModel, { color: theme.text }]}>{motorcycle.modelo}</Text>
                    <Text style={[styles.motorcyclePlate, { color: theme.textSecondary }]}>{motorcycle.placa}</Text>
                  </View>
                  <Text style={[styles.motorcycleBrand, { color: theme.textSecondary }]}>{motorcycle.fabricante}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Empty State */}
        {motorcycles.length === 0 && !loading && (
          <View style={styles.emptyState}>
            <View style={[styles.emptyIcon, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="bicycle" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhuma moto cadastrada</Text>
            <Text style={[styles.emptySubtitle, { color: theme.textSecondary }]}>
              Comece adicionando sua primeira moto
            </Text>
            <TouchableOpacity
              style={[styles.emptyButton, { backgroundColor: theme.primary }]}
              onPress={() => navigation.navigate("AddMotorcycle")}
            >
              <Text style={styles.emptyButtonText}>Cadastrar Moto</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 32,
  },
  greeting: {
    fontSize: 16,
    marginBottom: 4,
  },
  userName: {
    fontSize: 24,
    fontWeight: "bold",
  },
  logoutButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  statsContainer: {
    flexDirection: "row",
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: "transparent",
  },
  statNumber: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: "#FFFFFF",
    opacity: 0.9,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  seeAllText: {
    fontSize: 16,
    fontWeight: "600",
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  actionSubtitle: {
    fontSize: 14,
    marginTop: 2,
  },
  motorcyclesList: {
    gap: 12,
  },
  motorcycleCard: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  motorcycleIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
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
  },
  motorcyclePlate: {
    fontSize: 14,
    marginTop: 2,
  },
  motorcycleBrand: {
    fontSize: 14,
    fontWeight: "500",
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
