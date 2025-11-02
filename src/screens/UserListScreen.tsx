"use client";

import type React from "react";
import { useCallback, useEffect, useState } from "react";
import {
  SafeAreaView, View, Text, StyleSheet, FlatList, TouchableOpacity,
  Alert, RefreshControl, TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../contexts/ThemeContext";
import { userService, type User } from "../services/userService";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const UserListScreen: React.FC = () => {
  const { theme } = useTheme();
  const nav = useNavigation<any>();
  const [users, setUsers] = useState<User[]>([]);
  const [filtered, setFiltered] = useState<User[]>([]);
  const [search, setSearch] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  useFocusEffect(useCallback(() => { load(); }, []));
  useEffect(() => { filter(); }, [users, search]);

  const load = async () => {
    try {
      const data = await userService.list();
      setUsers(data);
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar os usuários");
    } finally {
      setRefreshing(false);
    }
  };

  const filter = () => {
    const q = search.trim().toLowerCase();
    if (!q) return setFiltered(users);
    setFiltered(users.filter(u =>
      u.nome.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.username.toLowerCase().includes(q) ||
      u.role.toLowerCase().includes(q),
    ));
  };

  const askDelete = (u: User) => {
    Alert.alert("Excluir usuário", `Deseja excluir ${u.nome}?`, [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Excluir", style: "destructive",
        onPress: async () => {
          try {
            await userService.delete(u.id);
            load();
            Alert.alert("Sucesso", "Usuário excluído");
          } catch {
            Alert.alert("Erro", "Não foi possível excluir o usuário");
          }
        },
      },
    ]);
  };

  const renderItem = ({ item }: { item: User }) => (
    <View style={[styles.card, { backgroundColor: theme.surface, borderColor: theme.border }]}>
      <View style={styles.row}>
        <View style={[styles.icon, { backgroundColor: `${theme.primary}20` }]}>
          <Ionicons name="person" size={24} color={theme.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.title, { color: theme.text }]}>{item.nome}</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>{item.email}</Text>
          <Text style={[styles.sub, { color: theme.textSecondary }]}>{item.username} · {item.role}</Text>
        </View>
        <View style={styles.actions}>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${theme.primary}20` }]}
            onPress={() => nav.navigate("EditUser", { user: item })}
          >
            <Ionicons name="pencil" size={16} color={theme.primary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: `${theme.error}20` }]}
            onPress={() => askDelete(item)}
          >
            <Ionicons name="trash" size={16} color={theme.error} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* header */}
      <View style={styles.header}>
        <View style={styles.backSpace} />
        <Text style={[styles.headerTitle, { color: theme.text }]}>Usuários</Text>
        <TouchableOpacity
          onPress={() => nav.navigate("AddUser")}
          style={[styles.addButton, { backgroundColor: theme.primary }]}
        >
          <Ionicons name="add" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* search */}
      <View style={styles.searchWrap}>
        <View style={[styles.searchBox, { backgroundColor: theme.surface, borderColor: theme.border }]}>
          <Ionicons name="search" size={20} color={theme.textSecondary} />
          <TextInput
            style={[styles.searchInput, { color: theme.text }]}
            placeholder="Buscar por nome, email, username ou role..."
            placeholderTextColor={theme.textSecondary}
            value={search}
            onChangeText={setSearch}
          />
          {!!search && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={20} color={theme.textSecondary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* list */}
      <FlatList
        data={filtered}
        keyExtractor={(i) => String(i.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <View style={[styles.emptyIcon, { backgroundColor: `${theme.primary}20` }]}>
              <Ionicons name="people" size={48} color={theme.primary} />
            </View>
            <Text style={[styles.emptyTitle, { color: theme.text }]}>Nenhum usuário</Text>
            <Text style={[styles.emptySub, { color: theme.textSecondary }]}>Toque em “+” para cadastrar</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingVertical: 16 },
  backSpace: { width: 40, height: 40 },
  headerTitle: { fontSize: 18, fontWeight: "600" },
  addButton: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  searchWrap: { paddingHorizontal: 20, marginBottom: 16 },
  searchBox: { flexDirection: "row", alignItems: "center", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12, borderWidth: 1, gap: 12 },
  searchInput: { flex: 1, fontSize: 16 },
  list: { paddingHorizontal: 20, paddingBottom: 20 },
  card: { padding: 16, borderRadius: 16, borderWidth: 1, marginBottom: 12 },
  row: { flexDirection: "row", alignItems: "center" },
  icon: { width: 48, height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginRight: 12 },
  title: { fontSize: 16, fontWeight: "600", marginBottom: 2 },
  sub: { fontSize: 14, marginBottom: 2 },
  actions: { flexDirection: "row", gap: 8 },
  actionBtn: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  empty: { alignItems: "center", paddingVertical: 48 },
  emptyIcon: { width: 96, height: 96, borderRadius: 24, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  emptyTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 8 },
  emptySub: { fontSize: 16, textAlign: "center" },
});

export default UserListScreen;
