"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { Ionicons } from "@expo/vector-icons"
import { AuthProvider, useAuth } from "./src/contexts/AuthContext"
import { ThemeProvider, useTheme } from "./src/contexts/ThemeContext"
import { AuthScreen } from "./src/screens/AuthScreen"
import { HomeScreen } from "./src/screens/HomeScreen"
import { AddMotorcycleScreen } from "./src/screens/AddMotorcycleScreen"
import { MotorcycleListScreen } from "./src/screens/MotorcycleListScreen"
import { EditMotorcycleScreen } from "./src/screens/EditMotorcycleScreen"
import { SettingsScreen } from "./src/screens/SettingsScreen"
import { ActivityIndicator, View } from "react-native"

const Stack = createStackNavigator()
const Tab = createBottomTabNavigator()

const TabNavigator = () => {
  const { theme } = useTheme()

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "MotorcycleList") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "AddMotorcycle") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "Settings") {
            iconName = focused ? "settings" : "settings-outline"
          } else {
            iconName = "help-outline"
          }

          return <Ionicons name={iconName} size={size} color={color} />
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
      <Tab.Screen name="Home" component={HomeScreen} options={{ tabBarLabel: "Início" }} />
      <Tab.Screen name="MotorcycleList" component={MotorcycleListScreen} options={{ tabBarLabel: "Motos" }} />
      <Tab.Screen name="AddMotorcycle" component={AddMotorcycleScreen} options={{ tabBarLabel: "Cadastrar" }} />
      <Tab.Screen name="Settings" component={SettingsScreen} options={{ tabBarLabel: "Config" }} />
    </Tab.Navigator>
  )
}

const AppNavigator = () => {
  const { user, loading } = useAuth()
  const { theme } = useTheme()

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: theme.background }}>
        <ActivityIndicator size="large" color={theme.primary} />
      </View>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {user ? (
          <>
            <Stack.Screen name="Main" component={TabNavigator} />
            <Stack.Screen name="EditMotorcycle" component={EditMotorcycleScreen} />
          </>
        ) : (
          <Stack.Screen name="Auth" component={AuthScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <AppNavigator />
      </AuthProvider>
    </ThemeProvider>
  )
}
