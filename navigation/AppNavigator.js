import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeScreen from "../screens/HomeScreen";
import ControlScreen from "../screens/ControlScreen";
import SensorsScreen from "../screens/SensorsScreen";
import GPSScreen from "../screens/GPSScreen";
import AlertsScreen from "../screens/AlertsScreen";
import CropPredictionScreen from "../screens/CropPredictionScreen";
import SettingsScreen from "../screens/SettingsScreen";
import CameraScreen from "../screens/CameraScreen";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
  const { theme, colors } = useTheme();
  const { t } = useLanguage();

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        headerShown: false,

        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.inactive,

        tabBarStyle: {
          height: 68,
          paddingBottom: 8,
          paddingTop: 6,
          backgroundColor: colors.card,
          borderTopWidth: 0,
          elevation: 10,
          shadowOpacity: theme === "dark" ? 0 : 0.08,
        },

        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: "600",
        },

        tabBarLabel: (() => {
          switch (route.name) {
            case "Home":
              return t("home");

            case "Control":
              return t("control");

            case "Sensors":
              return t("sensors");

            case "GPS":
              return t("gps");

            case "Alerts":
              return t("alerts");

            case "Crop AI":
              return t("cropAI");

            case "Camera":
              return t("camera");

            case "Settings":
              return t("settings");

            default:
              return route.name;
          }
        })(),

        tabBarIcon: ({ focused, color }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = focused
                ? "home"
                : "home-outline";
              break;

            case "Control":
              iconName = focused
                ? "game-controller"
                : "game-controller-outline";
              break;

            case "Sensors":
              iconName = focused
                ? "analytics"
                : "analytics-outline";
              break;

            case "GPS":
              iconName = focused
                ? "location"
                : "location-outline";
              break;

            case "Alerts":
              iconName = focused
                ? "notifications"
                : "notifications-outline";
              break;

            case "Crop AI":
              iconName = focused
                ? "leaf"
                : "leaf-outline";
              break;

            case "Camera":
              iconName = focused
                ? "camera"
                : "camera-outline";
              break;

            case "Settings":
              iconName = focused
                ? "settings"
                : "settings-outline";
              break;

            default:
              iconName = "ellipse-outline";
          }

          return (
            <Ionicons
              name={iconName}
              size={focused ? 25 : 23}
              color={color}
            />
          );
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
      />

      <Tab.Screen
        name="Control"
        component={ControlScreen}
      />

      <Tab.Screen
        name="Sensors"
        component={SensorsScreen}
      />

      <Tab.Screen
        name="GPS"
        component={GPSScreen}
      />

      <Tab.Screen
        name="Alerts"
        component={AlertsScreen}
      />

      <Tab.Screen
        name="Crop AI"
        component={CropPredictionScreen}
      />

      <Tab.Screen
        name="Camera"
        component={CameraScreen}
      />

      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
      />
    </Tab.Navigator>
  );
}