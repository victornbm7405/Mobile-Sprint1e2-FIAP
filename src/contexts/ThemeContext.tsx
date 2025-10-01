"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export interface Theme {
  primary: string
  secondary: string
  background: string
  surface: string
  text: string
  textSecondary: string
  border: string
  success: string
  error: string
}

const lightTheme: Theme = {
  primary: "#10B981",
  secondary: "#059669",
  background: "#FFFFFF",
  surface: "#F9FAFB",
  text: "#111827",
  textSecondary: "#6B7280",
  border: "#E5E7EB",
  success: "#10B981",
  error: "#EF4444",
}

const darkTheme: Theme = {
  primary: "#10B981",
  secondary: "#059669",
  background: "#111827",
  surface: "#1F2937",
  text: "#F9FAFB",
  textSecondary: "#9CA3AF",
  border: "#374151",
  success: "#10B981",
  error: "#EF4444",
}

interface ThemeContextType {
  theme: Theme
  isDark: boolean
  toggleTheme: () => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export const useTheme = () => {
  const context = useContext(ThemeContext)
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    loadTheme()
  }, [])

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem("theme")
      if (savedTheme) {
        setIsDark(savedTheme === "dark")
      }
    } catch (error) {
      console.error("Error loading theme:", error)
    }
  }

  const toggleTheme = async () => {
    try {
      const newTheme = !isDark
      setIsDark(newTheme)
      await AsyncStorage.setItem("theme", newTheme ? "dark" : "light")
    } catch (error) {
      console.error("Error saving theme:", error)
    }
  }

  const theme = isDark ? darkTheme : lightTheme

  return <ThemeContext.Provider value={{ theme, isDark, toggleTheme }}>{children}</ThemeContext.Provider>
}
