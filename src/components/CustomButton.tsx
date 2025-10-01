"use client"

import type React from "react"
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from "react-native"
import { useTheme } from "../contexts/ThemeContext"

interface CustomButtonProps {
  title: string
  onPress: () => void
  variant?: "primary" | "secondary" | "outline"
  loading?: boolean
  disabled?: boolean
}

export const CustomButton: React.FC<CustomButtonProps> = ({
  title,
  onPress,
  variant = "primary",
  loading = false,
  disabled = false,
}) => {
  const { theme } = useTheme()

  const getButtonStyle = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          borderWidth: 1,
        }
      case "outline":
        return {
          backgroundColor: "transparent",
          borderColor: theme.primary,
          borderWidth: 2,
        }
      default:
        return {
          backgroundColor: theme.primary,
        }
    }
  }

  const getTextStyle = () => {
    switch (variant) {
      case "secondary":
        return { color: theme.text }
      case "outline":
        return { color: theme.primary }
      default:
        return { color: "#FFFFFF" }
    }
  }

  return (
    <TouchableOpacity
      style={[styles.button, getButtonStyle(), (disabled || loading) && styles.disabled]}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color={variant === "primary" ? "#FFFFFF" : theme.primary} />
      ) : (
        <Text style={[styles.text, getTextStyle()]}>{title}</Text>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 56,
  },
  text: {
    fontSize: 16,
    fontWeight: "600",
  },
  disabled: {
    opacity: 0.6,
  },
})
