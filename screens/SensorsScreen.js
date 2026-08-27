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

export default function SensorsScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const { colors } = useTheme();
  const { t } = useLanguage();

  const {
    connected,
    sensorData,
  } = useBluetooth();

  const onRefresh = () => {
    setRefreshing(true);

    setTimeout(() => {
      setRefreshing(false);
    }, 700);
  };

  return (
    <ScrollView
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
        },
      ]}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.green]}
        />
      }
    >

      {/* HEADER */}

      <View style={styles.headerRow}>
        <View>
          <Text
            style={[
              styles.title,
              { color: colors.green },
            ]}
          >
            {t("sensors")}
          </Text>

          <Text
            style={[
              styles.subtitle,
              { color: colors.secondaryText },
            ]}
          >
            Real-time rover monitoring
          </Text>
        </View>

        <View
          style={[
            styles.liveBadge,
            {
              backgroundColor:
                connected
                  ? colors.greenLight
                  : colors.cardSecondary,
            },
          ]}
        >
          <View
            style={[
              styles.liveDot,
              {
                backgroundColor:
                  connected
                    ? colors.green
                    : "#E53935",
              },
            ]}
          />

          <Text
            style={[
              styles.liveText,
              {
                color:
                  connected
                    ? colors.green
                    : "#E53935",
              },
            ]}
          >
            {connected ? "LIVE" : "OFFLINE"}
          </Text>
        </View>
      </View>


      {/* ENVIRONMENT */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Environmental Sensors
      </Text>

      <View style={styles.row}>

        <SensorCard
          icon="thermometer-outline"
          iconColor={colors.orange}
          value={
            sensorData?.temperature !== null
              ? `${sensorData.temperature.toFixed(1)}°C`
              : "--"
          }
          label={t("temperature")}
          source="DHT11"
          colors={colors}
        />

        <SensorCard
          icon="water-outline"
          iconColor={colors.blue}
          value={
            sensorData?.humidity !== null
              ? `${sensorData.humidity.toFixed(1)}%`
              : "--"
          }
          label={t("humidity")}
          source="DHT11"
          colors={colors}
        />

      </View>


      {/* SOIL */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Soil Monitoring
      </Text>

      <View style={styles.row}>

        <SensorCard
          icon="leaf-outline"
          iconColor={colors.green}
          value={
            sensorData?.soilMoisture !== null
              ? String(sensorData.soilMoisture)
              : "--"
          }
          label={t("soilMoisture")}
          source="Capacitive Sensor"
          colors={colors}
        />

        <SensorCard
          icon="flask-outline"
          iconColor={colors.purple}
          value="--"
          label={t("soilPH")}
          source="Not connected"
          waiting
          colors={colors}
        />

      </View>


      {/* ROVER SAFETY */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Rover Safety
      </Text>

      <Card
        style={[
          styles.distanceCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View
          style={[
            styles.distanceIcon,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}
        >
          <Ionicons
            name="scan-outline"
            size={32}
            color={colors.orange}
          />
        </View>

        <View style={styles.distanceInfo}>
          <Text
            style={[
              styles.distanceTitle,
              { color: colors.text },
            ]}
          >
            Obstacle Distance
          </Text>

          <Text
            style={[
              styles.distanceValue,
              { color: colors.text },
            ]}
>
  {sensorData?.distance !== null
    ? sensorData.distance > 0
      ? `${sensorData.distance} cm`
      : "No reading"
    : "--"}
</Text>

          <Text
            style={[
              styles.distanceSource,
              { color: colors.mutedText },
            ]}
          >
            HC-SR04 Ultrasonic Sensor
          </Text>
        </View>

        <View
          style={[
            styles.waitingBadge,
            {
              backgroundColor:
                colors.cardSecondary,
            },
          ]}
        >
          <Text
            style={[
              styles.waitingText,
              { color: colors.mutedText },
            ]}
          >
            Auto
          </Text>
        </View>
      </Card>


      {/* BATTERY */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Rover Power
      </Text>

      <Card
        style={[
          styles.batteryCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.batteryIcon}>
          <Ionicons
            name="battery-half-outline"
            size={32}
            color={colors.green}
          />
        </View>

        <View style={styles.batteryInfo}>
          <Text
            style={[
              styles.batteryTitle,
              { color: colors.text },
            ]}
          >
            Battery Voltage
          </Text>

          <Text
            style={[
              styles.batteryValue,
              { color: colors.green },
            ]}
          >
            {sensorData?.battery !== null
              ? `${sensorData.battery.toFixed(2)} V`
              : "--"}
          </Text>
        </View>
      </Card>


      {/* STATUS */}

      <Card
        style={[
          styles.statusCard,
          { backgroundColor: colors.card },
        ]}
      >
        <View style={styles.statusHeader}>

          <Ionicons
            name={
              connected
                ? "checkmark-circle"
                : "close-circle"
            }
            size={25}
            color={
              connected
                ? colors.green
                : "#E53935"
            }
          />

          <Text
            style={[
              styles.statusTitle,
              { color: colors.text },
            ]}
          >
            Rover Environment
          </Text>

        </View>

        <Text
          style={[
            styles.statusText,
            { color: colors.secondaryText },
          ]}
        >
          {connected
            ? "Live sensor data is coming from the Arduino through HC-05."
            : "Connect to the rover from the Control page first."}
        </Text>

        <Text
          style={[
            styles.updatedText,
            { color: colors.mutedText },
          ]}
        >
          Last update:{" "}
          {sensorData?.timestamp
            ? new Date(
                sensorData.timestamp
              ).toLocaleTimeString()
            : "--"}
        </Text>
      </Card>

    </ScrollView>
  );
}


/* SENSOR CARD */

function SensorCard({
  icon,
  iconColor,
  value,
  label,
  source,
  waiting = false,
  colors,
}) {
  return (
    <Card
      style={[
        styles.sensorCard,
        {
          backgroundColor: colors.card,
        },
      ]}
    >
      <View
        style={[
          styles.sensorIcon,
          {
            backgroundColor:
              colors.greenLight,
          },
        ]}
      >
        <Ionicons
          name={icon}
          size={30}
          color={iconColor}
        />
      </View>

      <Text
        style={[
          styles.sensorValue,
          { color: colors.text },
        ]}
      >
        {value}
      </Text>

      <Text
        style={[
          styles.sensorLabel,
          { color: colors.text },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.sensorSource,
          { color: colors.mutedText },
        ]}
      >
        {waiting
          ? "Waiting for hardware"
          : source}
      </Text>
    </Card>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  content: {
    padding: 20,
    paddingBottom: 35,
  },

  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    marginBottom: 25,
  },

  title: {
    fontSize: 28,
    fontWeight: "bold",
  },

  subtitle: {
    marginTop: 5,
    fontSize: 15,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
  },

  liveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },

  liveText: {
    fontSize: 12,
    fontWeight: "bold",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 12,
    marginTop: 5,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },

  sensorCard: {
    width: "48%",
    padding: 18,
    borderRadius: 18,
    elevation: 3,
    alignItems: "center",
  },

  sensorIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  sensorValue: {
    fontSize: 26,
    fontWeight: "bold",
  },

  sensorLabel: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 4,
    textAlign: "center",
  },

  sensorSource: {
    fontSize: 11,
    marginTop: 6,
    textAlign: "center",
  },

  distanceCard: {
    padding: 18,
    borderRadius: 18,
    elevation: 3,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 22,
  },

  distanceIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
  },

  distanceInfo: {
    flex: 1,
    marginLeft: 15,
  },

  distanceTitle: {
    fontSize: 15,
    fontWeight: "600",
  },

  distanceValue: {
    fontSize: 25,
    fontWeight: "bold",
    marginTop: 3,
  },

  distanceSource: {
    fontSize: 11,
    marginTop: 3,
  },

  waitingBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },

  waitingText: {
    fontSize: 11,
    fontWeight: "600",
  },

  batteryCard: {
    padding: 18,
    borderRadius: 18,
    elevation: 3,
    marginBottom: 22,
  },

  batteryIcon: {
    marginBottom: 8,
  },

  batteryInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  batteryTitle: {
    fontSize: 16,
    fontWeight: "600",
  },

  batteryValue: {
    fontSize: 25,
    fontWeight: "bold",
  },

  statusCard: {
    padding: 18,
    borderRadius: 18,
    elevation: 3,
  },

  statusHeader: {
    flexDirection: "row",
    alignItems: "center",
  },

  statusTitle: {
    fontSize: 17,
    fontWeight: "bold",
    marginLeft: 9,
  },

  statusText: {
    marginTop: 10,
  },

  updatedText: {
    fontSize: 12,
    marginTop: 8,
  },
});