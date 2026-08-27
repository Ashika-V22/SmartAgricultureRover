import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
  ActivityIndicator,
} from "react-native";

import AsyncStorage from "@react-native-async-storage/async-storage";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

export default function SettingsScreen({ navigation }) {
  const { themeMode, changeTheme, colors, isDark } = useTheme();
  const { language, changeLanguage, t } = useLanguage();

  const [user, setUser] = useState(null);
  const [alertsEnabled, setAlertsEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("user");

      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.log("Error loading user:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    Alert.alert(
      t("logout"),
      t("logoutConfirm"),
      [
        {
          text: t("cancel"),
          style: "cancel",
        },
        {
          text: t("logout"),
          style: "destructive",
          onPress: async () => {
            try {
              await AsyncStorage.removeItem("user");

              navigation.reset({
                index: 0,
                routes: [{ name: "Login" }],
              });
            } catch (error) {
              console.log("Logout error:", error);
            }
          },
        },
      ]
    );
  };

  const selectTheme = () => {
    Alert.alert(
      t("theme"),
      t("applicationAppearance"),
      [
        {
          text: `☀️ ${t("light")}`,
          onPress: () => changeTheme("light"),
        },
        {
          text: `🌙 ${t("dark")}`,
          onPress: () => changeTheme("dark"),
        },
        {
          text: `⚙️ ${t("system")}`,
          onPress: () => changeTheme("system"),
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ]
    );
  };

  const selectLanguage = () => {
    Alert.alert(
      t("language"),
      t("applicationLanguage"),
      [
        {
          text: "English",
          onPress: () => changeLanguage("English"),
        },
        {
          text: "ಕನ್ನಡ",
          onPress: () => changeLanguage("Kannada"),
        },
        {
          text: "हिन्दी",
          onPress: () => changeLanguage("Hindi"),
        },
        {
          text: t("cancel"),
          style: "cancel",
        },
      ]
    );
  };

  const getThemeName = () => {
    if (themeMode === "light") return t("light");
    if (themeMode === "dark") return t("dark");
    return t("system");
  };

  const getLanguageName = () => {
    if (language === "Kannada") return "ಕನ್ನಡ";
    if (language === "Hindi") return "हिन्दी";
    return "English";
  };

  if (loading) {
    return (
      <View
        style={[
          styles.loadingContainer,
          { backgroundColor: colors.background },
        ]}
      >
        <ActivityIndicator
          size="large"
          color={colors.green}
        />
      </View>
    );
  }

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: colors.background },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}

      <Text
        style={[
          styles.title,
          { color: colors.text },
        ]}
      >
        {t("settings")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        {t("managePreferences")}
      </Text>

      {/* Profile */}

      <View
        style={[
          styles.profileCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View
          style={[
            styles.avatar,
            { backgroundColor: colors.greenLight },
          ]}
        >
          <Text
            style={[
              styles.avatarText,
              { color: colors.green },
            ]}
          >
            {user?.name
              ? user.name.charAt(0).toUpperCase()
              : "U"}
          </Text>
        </View>

        <View style={styles.profileInfo}>
          <Text
            style={[
              styles.name,
              { color: colors.text },
            ]}
          >
            {user?.name || "User"}
          </Text>

          <Text
            style={[
              styles.username,
              { color: colors.green },
            ]}
          >
            @{user?.username || "username"}
          </Text>

          <Text
            style={[
              styles.email,
              { color: colors.secondaryText },
            ]}
          >
            {user?.email || "No email"}
          </Text>
        </View>
      </View>

      {/* Account */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {t("account")}
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
        ]}
      >
        {/* Language */}

        <TouchableOpacity
          style={styles.settingRow}
          onPress={selectLanguage}
        >
          <View>
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text },
              ]}
            >
              {t("language")}
            </Text>

            <Text
              style={[
                styles.settingDescription,
                { color: colors.secondaryText },
              ]}
            >
              {t("applicationLanguage")}
            </Text>
          </View>

          <Text
            style={[
              styles.value,
              { color: colors.green },
            ]}
          >
            {getLanguageName()}
          </Text>
        </TouchableOpacity>

        <View
          style={[
            styles.divider,
            { backgroundColor: colors.divider },
          ]}
        />

        {/* Theme */}

        <TouchableOpacity
          style={styles.settingRow}
          onPress={selectTheme}
        >
          <View>
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text },
              ]}
            >
              {t("theme")}
            </Text>

            <Text
              style={[
                styles.settingDescription,
                { color: colors.secondaryText },
              ]}
            >
              {t("applicationAppearance")}
            </Text>
          </View>

          <Text
            style={[
              styles.value,
              { color: colors.green },
            ]}
          >
            {getThemeName()}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notifications */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {t("notifications")}
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.settingRow}>
          <View style={styles.settingTextContainer}>
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text },
              ]}
            >
              {t("roverAlerts")}
            </Text>

            <Text
              style={[
                styles.settingDescription,
                { color: colors.secondaryText },
              ]}
            >
              {t("unusualSensorReadings")}
            </Text>
          </View>

          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
            trackColor={{
              false: colors.border,
              true: colors.greenLight,
            }}
            thumbColor={
              alertsEnabled
                ? colors.green
                : "#AAAAAA"
            }
          />
        </View>
      </View>

      {/* Rover */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        {t("rover")}
      </Text>

      <View
        style={[
          styles.card,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.settingRow}>
          <View>
            <Text
              style={[
                styles.settingTitle,
                { color: colors.text },
              ]}
            >
              {t("connection")}
            </Text>

            <Text
              style={[
                styles.settingDescription,
                { color: colors.secondaryText },
              ]}
            >
              {t("backendCommunication")}
            </Text>
          </View>

          <View style={styles.statusContainer}>
            <View
              style={[
                styles.statusDot,
                { backgroundColor: colors.green },
              ]}
            />

            <Text
              style={[
                styles.statusText,
                { color: colors.green },
              ]}
            >
              {t("connected")}
            </Text>
          </View>
        </View>
      </View>

      {/* Logout */}

      <TouchableOpacity
        style={[
          styles.logoutButton,
          {
            backgroundColor: colors.card,
            borderColor: colors.danger,
          },
        ]}
        onPress={handleLogout}
        activeOpacity={0.8}
      >
        <Text
          style={[
            styles.logoutText,
            { color: colors.danger },
          ]}
        >
          {t("logout")}
        </Text>
      </TouchableOpacity>

      <Text
        style={[
          styles.footer,
          { color: colors.secondaryText },
        ]}
      >
        Smart Agriculture Rover
      </Text>

      <Text
        style={[
          styles.version,
          { color: colors.mutedText },
        ]}
      >
        AI Powered Farming • Version 1.0.0
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    marginTop: 10,
  },

  subtitle: {
    fontSize: 14,
    marginTop: 5,
    marginBottom: 22,
  },

  profileCard: {
    borderRadius: 20,
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
  },

  avatar: {
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: "center",
    alignItems: "center",
  },

  avatarText: {
    fontSize: 27,
    fontWeight: "800",
  },

  profileInfo: {
    marginLeft: 15,
    flex: 1,
  },

  name: {
    fontSize: 19,
    fontWeight: "800",
  },

  username: {
    marginTop: 2,
    fontWeight: "600",
  },

  email: {
    fontSize: 13,
    marginTop: 4,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "800",
    marginTop: 25,
    marginBottom: 10,
  },

  card: {
    borderRadius: 18,
    paddingHorizontal: 18,
    elevation: 2,
  },

  settingRow: {
    minHeight: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  settingTextContainer: {
    flex: 1,
    paddingRight: 15,
  },

  settingTitle: {
    fontSize: 15,
    fontWeight: "700",
  },

  settingDescription: {
    fontSize: 12,
    marginTop: 4,
  },

  value: {
    fontSize: 14,
    fontWeight: "700",
  },

  divider: {
    height: 1,
  },

  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
    marginRight: 6,
  },

  statusText: {
    fontSize: 13,
    fontWeight: "700",
  },

  logoutButton: {
    height: 52,
    borderRadius: 14,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 28,
  },

  logoutText: {
    fontSize: 16,
    fontWeight: "800",
  },

  footer: {
    textAlign: "center",
    marginTop: 28,
    fontWeight: "600",
  },

  version: {
    textAlign: "center",
    marginTop: 4,
    fontSize: 11,
  },
});