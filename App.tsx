import 'react-native-gesture-handler';

"use client";

import "./src/utils/internationalization"; // inicializa i18n UMA vez

import React, { useEffect } from "react"; // ⬅️ adicionado useEffect
import { NavigationContainer, createNavigationContainerRef } from "@react-navigation/native"; // ⬅️ adicionado createNavigationContainerRef
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications"; // ⬅️ adicionado
import { useTranslation } from "react-i18next";
import { ActivityIndicator, View } from "react-native";

import { AuthProvider, useAuth } from "./src/contexts/AuthContext";
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext";

import { AuthScreen } from "./src/screens/AuthScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { AddMotorcycleScreen } from "./src/screens/AddMotorcycleScreen";
import { MotorcycleListScreen } from "./src/screens/MotorcycleListScreen";
import { EditMotorcycleScreen } from "./src/screens/EditMotorcycleScreen";
import { SettingsScreen } from "./src/screens/SettingsScreen";

// ▼ NOVAS TELAS (import default e caminho singular)
import UserListScreen from "./src/screens/UserListScreen";
import AddUserScreen from "./src/screens/AddUserScreen";
import EditUserScreen from "./src/screens/EditUserScreen";

// ✅ (1) IMPORT NECESSÁRIO: AboutScreen
import AboutScreen from "./src/screens/AboutScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// ⬇️ ref global para navegar a partir do listener de notificação
const navigationRef = createNavigationContainerRef<any>();

const TabNavigator = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation(); // pegar i18n para forçar remount

  return (
    <Tab.Navigator
      key={i18n.language} // ⬅️ força recriar as tabs quando o idioma mudar
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "MotorcycleList") {
            iconName = focused ? "list" : "list-outline";
          } else if (route.name === "UsersList") {
            iconName = focused ? "people" : "people-outline";
          } else if (route.name === "AddMotorcycle") {
            iconName = focused ? "add-circle" : "add-circle-outline";
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: {
          backgroundColor: theme.surface,
          borderTopColor: theme.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "600",
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{ tabBarLabel: t("tabs.home", { defaultValue: "Início" }) }}
      />
      <Tab.Screen
        name="MotorcycleList"
        component={MotorcycleListScreen}
        options={{ tabBarLabel: t("tabs.motorcycles", { defaultValue: "Motos" }) }}
      />
      <Tab.Screen
        name="UsersList"
        component={UserListScreen}
        options={{ tabBarLabel: t("tabs.users", { defaultValue: "Usuários" }) }}
      />
      <Tab.Screen
        name="AddMotorcycle"
        component={AddMotorcycleScreen}
        options={{ tabBarLabel: t("tabs.add", { defaultValue: "Cadastrar" }) }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarLabel: t("tabs.settings", { defaultValue: "Config" }) }}
      />
    </Tab.Navigator>
  );
};

const AppNavigator = () => {
  const { user, loading } = useAuth();
  const { theme } = useTheme();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    );
  }

  return (
    // ⬇️ passamos o ref para navegar ao tocar na notificação
    <NavigationContainer ref={navigationRef}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="EditMotorcycle" component={EditMotorcycleScreen} />
            {/* ▼ Rotas adicionais de usuário */}
            <Stack.Screen name="AddUser" component={AddUserScreen} />
            <Stack.Screen name="EditUser" component={EditUserScreen} />
            {/* ✅ (2) ROTA NECESSÁRIA: About */}
            <Stack.Screen name="About" component={AboutScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default function App() {
  // ⬇️ Listener para abrir a tela ao tocar / iniciar pelo push
  useEffect(() => {
    const sub = Notifications.addNotificationResponseReceivedListener((response) => {
      const data: any = response.notification.request.content.data;
      if (data?.motoId && navigationRef.isReady()) {
        navigationRef.navigate("EditMotorcycle", { id: data.motoId });
      }
    });

    // Se o app foi ABERTO a partir de uma notificação (estado "morto")
    (async () => {
      const last = await Notifications.getLastNotificationResponseAsync();
      const data: any = last?.notification.request.content.data;
      if (last && data?.motoId && navigationRef.isReady()) {
        navigationRef.navigate("EditMotorcycle", { id: data.motoId });
      }
    })();

    return () => sub.remove();
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  );
}
