import AsyncStorage from '@react-native-async-storage/async-storage';

class LocalStore {
  static async getItem<T>(key: string): Promise<T | null> {
    try {
      const item = await AsyncStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return null;
    } catch (error) {
      console.error(`Error retrieving data from AsyncStorage for key '${key}':`, error);
      return null;
    }
  }

  static async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`Error setting data in AsyncStorage for key '${key}':`, error);
    }
  }

  static async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Error removing data from AsyncStorage for key '${key}':`, error);
    }
  }
}

export default LocalStore;
