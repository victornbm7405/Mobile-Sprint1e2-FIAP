import AsyncStorage from "@react-native-async-storage/async-storage"
import type { Motorcycle } from "../types/motorcycle"

const STORAGE_KEY = "motorcycles"

export const motorcycleService = {
  async getAll(): Promise<Motorcycle[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEY)
      return data ? JSON.parse(data) : []
    } catch (error) {
      console.error("Error getting motorcycles:", error)
      return []
    }
  },

  async save(motorcycle: Omit<Motorcycle, "id" | "createdAt">): Promise<Motorcycle> {
    try {
      const motorcycles = await this.getAll()
      const newMotorcycle: Motorcycle = {
        ...motorcycle,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      }
      motorcycles.push(newMotorcycle)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(motorcycles))
      return newMotorcycle
    } catch (error) {
      console.error("Error saving motorcycle:", error)
      throw error
    }
  },

  async update(id: string, updates: Partial<Omit<Motorcycle, "id" | "createdAt">>): Promise<void> {
    try {
      const motorcycles = await this.getAll()
      const index = motorcycles.findIndex((m) => m.id === id)
      if (index !== -1) {
        motorcycles[index] = { ...motorcycles[index], ...updates }
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(motorcycles))
      }
    } catch (error) {
      console.error("Error updating motorcycle:", error)
      throw error
    }
  },

  async delete(id: string): Promise<void> {
    try {
      const motorcycles = await this.getAll()
      const filtered = motorcycles.filter((m) => m.id !== id)
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(filtered))
    } catch (error) {
      console.error("Error deleting motorcycle:", error)
      throw error
    }
  },
}
