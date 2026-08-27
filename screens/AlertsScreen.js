import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";

import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useBluetooth } from "../context/BluetoothContext";

export default function AlertsScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  const {
    connected,
    sensorData,
  } = useBluetooth();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  const alerts = generateAlerts(
    sensorData,
    connected,
    t
  );

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.green]}
          tintColor={colors.green}
        />
      }
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View style={styles.headerTextContainer}>

          <Text
            style={[
              styles.title,
              {
                color: colors.green,
              },
            ]}
          >
            {t("alerts")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              {
                color: colors.secondaryText,
              },
            ]}
          >
            {t("roverSafetyMonitoring")}
          </Text>

        </View>

        <View
          style={[
            styles.headerIcon,
            {
              backgroundColor:
                colors.greenLight,
            },
          ]}
        >

          <Ionicons
            name="notifications-outline"
            size={28}
            color={colors.green}
          />

        </View>

      </View>


      {/* CONNECTION STATUS */}

      <Card
        style={[
          styles.connectionCard,
          {
            backgroundColor: colors.card,
            elevation: isDark ? 0 : 3,
          },
        ]}
      >

        <Ionicons
          name={
            connected
              ? "bluetooth"
              : "bluetooth-outline"
          }
          size={25}
          color={
            connected
              ? colors.green
              : colors.danger
          }
        />

        <Text
          style={[
            styles.connectionText,
            {
              color:
                connected
                  ? colors.green
                  : colors.danger,
            },
          ]}
        >
          {connected
            ? "HC-05 Connected"
            : "Rover Disconnected"}
        </Text>

      </Card>


      {/* SYSTEM STATUS */}

      <Card
        style={[
          styles.statusCard,
          {
            backgroundColor: colors.card,
            elevation: isDark ? 0 : 3,
          },
        ]}
      >

        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor:
                alerts.length === 0
                  ? isDark
                    ? "#1B3A1E"
                    : "#E8F5E9"
                  : isDark
                  ? "#4A321A"
                  : "#FFF3E0",
            },
          ]}
        >

          <Ionicons
            name={
              alerts.length === 0
                ? "checkmark-circle"
                : "warning"
            }
            size={32}
            color={
              alerts.length === 0
                ? colors.green
                : colors.orange
            }
          />

        </View>

        <View style={styles.statusInfo}>

          <Text
            style={[
              styles.statusTitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {t("systemStatus")}
          </Text>

          <Text
            style={[
              styles.statusText,
              {
                color:
                  alerts.length === 0
                    ? colors.green
                    : colors.orange,
              },
            ]}
          >

            {alerts.length === 0
              ? t("allConditionsNormal")
              : `${alerts.length} ${
                  alerts.length > 1
                    ? t("alertsDetected")
                    : t("alertDetected")
                }`}

          </Text>

        </View>

      </Card>


      {/* CURRENT ALERTS */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {t("currentAlerts")}
      </Text>


      {alerts.length === 0 ? (

        <Card
          style={[
            styles.emptyCard,
            {
              backgroundColor: colors.card,
              elevation: isDark ? 0 : 3,
            },
          ]}
        >

          <Ionicons
            name="shield-checkmark-outline"
            size={55}
            color={colors.green}
          />

          <Text
            style={[
              styles.emptyTitle,
              {
                color: colors.green,
              },
            ]}
          >
            {t("everythingLooksGood")}
          </Text>

          <Text
            style={[
              styles.emptyText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            {t("noAbnormalConditions")}
          </Text>

        </Card>

      ) : (

        alerts.map(
          (alert, index) => (
            <AlertCard
              key={index}
              alert={alert}
              colors={colors}
              isDark={isDark}
            />
          )
        )

      )}


      {/* MONITORED CONDITIONS */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color: colors.text,
          },
        ]}
      >
        {t("monitoredConditions")}
      </Text>

      <Card
        style={[
          styles.monitorCard,
          {
            backgroundColor: colors.card,
            elevation: isDark ? 0 : 3,
          },
        ]}
      >

        <MonitorRow
          icon="thermometer-outline"
          label={t("temperature")}
          value={
            sensorData?.temperature !== null
              ? `${sensorData.temperature.toFixed(1)}°C`
              : "--"
          }
          colors={colors}
        />

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.divider,
            },
          ]}
        />

        <MonitorRow
          icon="water-outline"
          label={t("humidity")}
          value={
            sensorData?.humidity !== null
              ? `${sensorData.humidity.toFixed(1)}%`
              : "--"
          }
          colors={colors}
        />

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.divider,
            },
          ]}
        />

        <MonitorRow
          icon="leaf-outline"
          label={t("soilMoisture")}
          value={
            sensorData?.soilMoisture !== null
              ? String(sensorData.soilMoisture)
              : "--"
          }
          colors={colors}
        />

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.divider,
            },
          ]}
        />

        <MonitorRow
          icon="navigate-outline"
          label={t("obstacleDistance")}
          value={
            sensorData?.distance !== null
              ? sensorData.distance > 0
                ? `${sensorData.distance} cm`
                : "No reading"
              : "--"
          }
          colors={colors}
        />

        <View
          style={[
            styles.divider,
            {
              backgroundColor:
                colors.divider,
            },
          ]}
        />

        <MonitorRow
          icon="battery-half-outline"
          label={t("battery")}
          value={
            sensorData?.battery !== null
              ? `${sensorData.battery.toFixed(2)} V`
              : "--"
          }
          colors={colors}
        />

      </Card>


      <Text
        style={[
          styles.note,
          {
            color: colors.mutedText,
          },
        ]}
      >
        Alerts update automatically using live rover sensor data.
      </Text>

    </ScrollView>
  );
}


/* =========================================
   GENERATE ALERTS
========================================= */

function generateAlerts(
  sensorData,
  connected,
  t
) {

  const alerts = [];


  // -----------------------------------------
  // BLUETOOTH DISCONNECTED
  // -----------------------------------------

  if (!connected) {

    alerts.push({
      type: "warning",
      icon: "bluetooth-outline",
      title: "Rover Disconnected",
      message:
        "Connect the rover from the Control page.",
    });

    return alerts;
  }


  if (!sensorData) {
    return alerts;
  }


  const temperature =
    Number(sensorData.temperature);

  const humidity =
    Number(sensorData.humidity);

  const soilMoisture =
    Number(sensorData.soilMoisture);

  const battery =
    Number(sensorData.battery);

  const distance =
    Number(sensorData.distance);


  // -----------------------------------------
  // TEMPERATURE
  // -----------------------------------------

  if (
    !Number.isNaN(temperature)
  ) {

    if (temperature >= 40) {

      alerts.push({
        type: "danger",
        icon: "thermometer",
        title: t("highTemperature"),
        message:
          `${t("temperatureIs")} ${temperature}°C. ${t(
            "cropEnvironmentTooHot"
          )}`,
      });

    } else if (
      temperature <= 10
    ) {

      alerts.push({
        type: "warning",
        icon: "thermometer-outline",
        title: t("lowTemperature"),
        message:
          `${t("temperatureIs")} ${temperature}°C. ${t(
            "monitorCropConditions"
          )}`,
      });
    }
  }


  // -----------------------------------------
  // HUMIDITY
  // -----------------------------------------

  if (
    !Number.isNaN(humidity)
  ) {

    if (humidity >= 90) {

      alerts.push({
        type: "warning",
        icon: "water",
        title: t("highHumidity"),
        message:
          `${t("humidityIs")} ${humidity}%. ${t(
            "excessHumidity"
          )}`,
      });

    } else if (
      humidity <= 25
    ) {

      alerts.push({
        type: "warning",
        icon: "water-outline",
        title: t("lowHumidity"),
        message:
          `${t("humidityIs")} ${humidity}%. ${t(
            "environmentDry"
          )}`,
      });
    }
  }


  // -----------------------------------------
  // SOIL MOISTURE RAW SENSOR VALUE
  //
  // Your sensor is giving raw values such as 866.
  // These are NOT percentages.
  //
  // Higher/lower direction depends on calibration,
  // so use this as a simple preliminary threshold.
  // -----------------------------------------

  if (
    !Number.isNaN(soilMoisture)
  ) {

    if (soilMoisture >= 850) {

      alerts.push({
        type: "warning",
        icon: "leaf-outline",
        title: "Low Soil Moisture",
        message:
          `Soil moisture reading is ${soilMoisture}. The soil may be dry.`,
      });
    }
  }


  // -----------------------------------------
  // OBSTACLE
  // -----------------------------------------

  if (
    !Number.isNaN(distance) &&
    distance > 0 &&
    distance < 20
  ) {

    alerts.push({
      type: "danger",
      icon: "warning-outline",
      title: "Obstacle Detected",
      message:
        `Obstacle detected ${distance} cm in front of the rover.`,
    });
  }


  // -----------------------------------------
  // BATTERY VOLTAGE
  //
  // Current rover readings are voltage,
  // not battery percentage.
  // -----------------------------------------

  if (
    !Number.isNaN(battery)
  ) {

    if (battery <= 6.5) {

      alerts.push({
        type: "danger",
        icon: "battery-dead-outline",
        title: "Low Battery",
        message:
          `Battery voltage is ${battery.toFixed(
            2
          )} V. Recharge the rover battery.`,
      });

    } else if (
      battery <= 7.0
    ) {

      alerts.push({
        type: "warning",
        icon: "battery-half-outline",
        title: "Battery Getting Low",
        message:
          `Battery voltage is ${battery.toFixed(
            2
          )} V. Consider recharging soon.`,
      });
    }
  }


  return alerts;
}


/* =========================================
   ALERT CARD
========================================= */

function AlertCard({
  alert,
  colors,
  isDark,
}) {

  const isDanger =
    alert.type === "danger";

  return (

    <Card
      style={[
        styles.alertCard,
        {
          backgroundColor:
            colors.card,

          elevation:
            isDark ? 0 : 3,
        },
      ]}
    >

      <View
        style={[
          styles.alertIcon,
          {
            backgroundColor:
              isDanger
                ? isDark
                  ? "#451A1A"
                  : "#FFEBEE"
                : isDark
                ? "#4A321A"
                : "#FFF3E0",
          },
        ]}
      >

        <Ionicons
          name={alert.icon}
          size={25}
          color={
            isDanger
              ? colors.danger
              : colors.orange
          }
        />

      </View>

      <View
        style={
          styles.alertInfo
        }
      >

        <Text
          style={[
            styles.alertTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          {alert.title}
        </Text>

        <Text
          style={[
            styles.alertMessage,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {alert.message}
        </Text>

      </View>

    </Card>
  );
}


/* =========================================
   MONITOR ROW
========================================= */

function MonitorRow({
  icon,
  label,
  value,
  colors,
}) {

  return (

    <View
      style={
        styles.monitorRow
      }
    >

      <Ionicons
        name={icon}
        size={22}
        color={colors.green}
      />

      <Text
        style={[
          styles.monitorLabel,
          {
            color:
              colors.text,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.monitorValue,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}


/* =========================================
   STYLES
========================================= */

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },

    header: {
      marginTop: 20,
      marginBottom: 22,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    headerTextContainer: {
      flex: 1,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
    },

    subtitle: {
      fontSize: 14,
      marginTop: 5,
    },

    headerIcon: {
      width: 55,
      height: 55,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
      marginLeft: 10,
    },

    connectionCard: {
      padding: 14,
      borderRadius: 16,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
    },

    connectionText: {
      marginLeft: 10,
      fontSize: 14,
      fontWeight: "700",
    },

    statusCard: {
      padding: 18,
      borderRadius: 18,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 25,
    },

    statusIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    statusInfo: {
      flex: 1,
    },

    statusTitle: {
      fontSize: 13,
    },

    statusText: {
      fontSize: 17,
      fontWeight: "bold",
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },

    emptyCard: {
      padding: 28,
      borderRadius: 18,
      alignItems: "center",
      marginBottom: 25,
    },

    emptyTitle: {
      fontSize: 19,
      fontWeight: "bold",
      marginTop: 14,
    },

    emptyText: {
      fontSize: 13,
      textAlign: "center",
      marginTop: 7,
      lineHeight: 19,
    },

    alertCard: {
      padding: 17,
      borderRadius: 17,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 12,
    },

    alertIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    alertInfo: {
      flex: 1,
    },

    alertTitle: {
      fontSize: 16,
      fontWeight: "bold",
    },

    alertMessage: {
      fontSize: 12,
      marginTop: 4,
      lineHeight: 17,
    },

    monitorCard: {
      padding: 18,
      borderRadius: 18,
      marginBottom: 15,
    },

    monitorRow: {
      minHeight: 50,
      flexDirection: "row",
      alignItems: "center",
    },

    monitorLabel: {
      flex: 1,
      marginLeft: 12,
      fontSize: 14,
      fontWeight: "600",
    },

    monitorValue: {
      fontSize: 13,
    },

    divider: {
      height: 1,
    },

    note: {
      textAlign: "center",
      fontSize: 11,
      marginTop: 5,
    },

  });