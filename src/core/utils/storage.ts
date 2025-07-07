export class LocalStorageControl {
  static get(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      console.error('Error getting from localStorage:', error);
      return null;
    }
  }

  static set(key: string, value: string): void {
    try {
      localStorage.setItem(key, value);
    } catch (error) {
      console.error('Error setting to localStorage:', error);
    }
  }

  static remove(key: string): void {
    try {
      localStorage.removeItem(key);
    } catch (error) {
      console.error('Error removing from localStorage:', error);
    }
  }

  static clear(): void {
    try {
      localStorage.clear();
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }

  static getJSON<T>(key: string): T | null {
    const value = this.get(key);
    if (!value) return null;
    
    try {
      return JSON.parse(value) as T;
    } catch (error) {
      console.error('Error parsing JSON from localStorage:', error);
      return null;
    }
  }

  static setJSON<T>(key: string, value: T): void {
    try {
      this.set(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error stringifying JSON for localStorage:', error);
    }
  }
}