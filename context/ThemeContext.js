import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  import { Appearance } from "react-native";
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const ThemeContext = createContext();
  
  export function ThemeProvider({ children }) {
    const [themeMode, setThemeMode] = useState("system");
    const [systemTheme, setSystemTheme] = useState(
      Appearance.getColorScheme() || "light"
    );
  
    useEffect(() => {
      loadTheme();
  
      const subscription = Appearance.addChangeListener(({ colorScheme }) => {
        setSystemTheme(colorScheme || "light");
      });
  
      return () => subscription.remove();
    }, []);
  
    const loadTheme = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem("theme");
  
        if (savedTheme) {
          setThemeMode(savedTheme);
        }
      } catch (error) {
        console.log("Theme loading error:", error);
      }
    };
  
    const changeTheme = async (mode) => {
      try {
        setThemeMode(mode);
        await AsyncStorage.setItem("theme", mode);
      } catch (error) {
        console.log("Theme saving error:", error);
      }
    };
  
    const isDark =
      themeMode === "dark" ||
      (themeMode === "system" && systemTheme === "dark");
  
    const colors = isDark
      ? {
          background: "#121212",
          card: "#1E1E1E",
          cardSecondary: "#252525",
  
          text: "#FFFFFF",
          secondaryText: "#B0B0B0",
          mutedText: "#888888",
  
          border: "#333333",
          divider: "#333333",
  
          green: "#66BB6A",
          greenLight: "#1B3A1E",
  
          blue: "#64B5F6",
          orange: "#FFB74D",
          purple: "#BA68C8",
  
          input: "#252525",
  
          danger: "#EF5350",
  
          tabBar: "#1A1A1A",
        }
      : {
          background: "#F2F8F1",
          card: "#FFFFFF",
          cardSecondary: "#F8FBF8",
  
          text: "#333333",
          secondaryText: "#666666",
          mutedText: "#999999",
  
          border: "#E5E7EB",
          divider: "#EEEEEE",
  
          green: "#2E7D32",
          greenLight: "#E8F5E9",
  
          blue: "#1565C0",
          orange: "#EF6C00",
          purple: "#6A1B9A",
  
          input: "#FFFFFF",
  
          danger: "#E53935",
  
          tabBar: "#FFFFFF",
        };
  
    return (
      <ThemeContext.Provider
        value={{
          themeMode,
          changeTheme,
          isDark,
          colors,
        }}
      >
        {children}
      </ThemeContext.Provider>
    );
  }
  
  export function useTheme() {
    return useContext(ThemeContext);
  }