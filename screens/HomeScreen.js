import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  StyleSheet,
} from "react-native";

import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useBluetooth } from "../context/BluetoothContext";

export default function HomeScreen() {

  const { colors } = useTheme();
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

  const styles = createStyles(colors);

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={[colors.green]}
        />
      }
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}

      <View style={styles.header}>

        <View>

          <Text style={styles.title}>
            {t("smartAgricultureRover")}
          </Text>

          <Text style={styles.subtitle}>
            {t("intelligentFarmingAssistant")}
          </Text>

        </View>

        <View
          style={[
            styles.connectionBadge,
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
              styles.connectionDot,
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
              styles.connectionText,
              {
                color:
                  connected
                    ? colors.green
                    : "#E53935",
              },
            ]}
          >
            {connected
              ? "ONLINE"
              : "OFFLINE"}
          </Text>

        </View>

      </View>


      {/* ROVER STATUS */}

      <Card style={styles.statusCard}>

        <View style={styles.statusLeft}>

          <View style={styles.roverIcon}>

            <Ionicons
              name="hardware-chip-outline"
              size={30}
              color={colors.green}
            />

          </View>

          <View>

            <Text style={styles.statusTitle}>
              Rover Status
            </Text>

            <Text
              style={[
                styles.statusOnline,
                {
                  color:
                    connected
                      ? colors.green
                      : "#E53935",
                },
              ]}
            >
              {connected
                ? "HC-05 Connected"
                : "Rover Disconnected"}
            </Text>

          </View>

        </View>

        <Ionicons
          name={
            connected
              ? "checkmark-circle"
              : "close-circle"
          }
          size={28}
          color={
            connected
              ? colors.green
              : "#E53935"
          }
        />

      </Card>


      {/* LIVE OVERVIEW */}

      <Text style={styles.sectionTitle}>
        {t("liveOverview")}
      </Text>

      <View style={styles.row}>

        {/* TEMPERATURE */}

        <MetricCard
          icon="thermometer-outline"
          value={
            sensorData?.temperature !== null
              ? `${sensorData.temperature.toFixed(1)}°C`
              : "--"
          }
          label={t("temperature")}
          color={colors.orange}
          styles={styles}
        />


        {/* HUMIDITY */}

        <MetricCard
          icon="water-outline"
          value={
            sensorData?.humidity !== null
              ? `${sensorData.humidity.toFixed(1)}%`
              : "--"
          }
          label={t("humidity")}
          color={colors.blue}
          styles={styles}
        />

      </View>


      <View style={styles.row}>

        {/* SOIL MOISTURE */}

        <MetricCard
          icon="leaf-outline"
          value={
            sensorData?.soilMoisture !== null
              ? String(sensorData.soilMoisture)
              : "--"
          }
          label={t("soilMoisture")}
          color={colors.green}
          styles={styles}
        />


        {/* BATTERY VOLTAGE */}

        <MetricCard
          icon="battery-half-outline"
          value={
            sensorData?.battery !== null
              ? `${sensorData.battery.toFixed(2)} V`
              : "--"
          }
          label={t("battery")}
          color="#558B2F"
          styles={styles}
        />

      </View>


      {/* SOIL & SAFETY */}

      <Text style={styles.sectionTitle}>
        {t("soilSafety")}
      </Text>

      <Card style={styles.infoCard}>

        {/* OBSTACLE DISTANCE */}

        <InfoRow
          icon="scan-outline"
          title={t("obstacleDetection")}
          value={
            sensorData?.distance !== null
              ? sensorData.distance > 0
                ? `${sensorData.distance} cm`
                : "No reading"
              : "--"
          }
          color={colors.orange}
          styles={styles}
        />

        <View style={styles.divider} />


        {/* PLOUGH / SAFETY STATUS */}

        <InfoRow
          icon="shield-checkmark-outline"
          title="Obstacle Safety"
          value={
            sensorData?.distance !== null &&
            sensorData.distance > 0 &&
            sensorData.distance < 20
              ? "Obstacle detected"
              : "Clear"
          }
          color={
            sensorData?.distance !== null &&
            sensorData.distance > 0 &&
            sensorData.distance < 20
              ? "#E53935"
              : colors.green
          }
          styles={styles}
        />

        <View style={styles.divider} />


        {/* GPS */}

        <InfoRow
          icon="location-outline"
          title={t("gps")}
          value="NEO-6M ready"
          color={colors.blue}
          styles={styles}
        />

      </Card>


      {/* CURRENT MODE */}

      <Card style={styles.modeCard}>

        <View style={styles.modeIcon}>

          <Ionicons
            name="navigate-outline"
            size={27}
            color={colors.green}
          />

        </View>

        <View style={styles.modeInfo}>

          <Text style={styles.modeLabel}>
            {t("currentMode")}
          </Text>

          <Text style={styles.modeValue}>
            {t("manualControl")}
          </Text>

        </View>

      </Card>


      {/* CROP AI */}

      <Card style={styles.cropCard}>

        <View style={styles.cropIcon}>

          <Ionicons
            name="sparkles"
            size={28}
            color={colors.green}
          />

        </View>

        <View style={styles.cropInfo}>

          <Text style={styles.cropTitle}>
            {t("cropAI")}
          </Text>

          <Text style={styles.cropText}>
            Get an intelligent crop recommendation
            using live rover sensor data and the crop prediction model.
          </Text>

        </View>

      </Card>


      {/* LAST UPDATE */}

      <Text style={styles.lastUpdate}>

        Last sensor update:{" "}

        {sensorData?.timestamp
          ? new Date(
              sensorData.timestamp
            ).toLocaleTimeString()
          : "--"}

      </Text>

    </ScrollView>
  );
}


/* -----------------------------------------
   Metric Card
----------------------------------------- */

function MetricCard({
  icon,
  value,
  label,
  color,
  styles,
}) {

  return (

    <Card style={styles.metricCard}>

      <View
        style={[
          styles.metricIcon,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={28}
          color={color}
        />

      </View>

      <Text style={styles.metricValue}>
        {value}
      </Text>

      <Text style={styles.metricLabel}>
        {label}
      </Text>

    </Card>
  );
}


/* -----------------------------------------
   Information Row
----------------------------------------- */

function InfoRow({
  icon,
  title,
  value,
  color,
  styles,
}) {

  return (

    <View style={styles.infoRow}>

      <View
        style={[
          styles.infoIcon,
          {
            backgroundColor:
              `${color}18`,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={22}
          color={color}
        />

      </View>

      <Text style={styles.infoTitle}>
        {title}
      </Text>

      <Text style={styles.infoValue}>
        {value}
      </Text>

    </View>
  );
}


/* -----------------------------------------
   Dynamic Styles
----------------------------------------- */

const createStyles = (colors) =>
  StyleSheet.create({

    container: {
      flex: 1,
      backgroundColor:
        colors.background,
    },

    content: {
      padding: 20,
      paddingBottom: 35,
    },

    header: {
      marginTop: 20,
      marginBottom: 22,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    title: {
      fontSize: 25,
      fontWeight: "bold",
      color: colors.green,
    },

    subtitle: {
      marginTop: 5,
      color:
        colors.secondaryText,
      fontSize: 14,
    },

    connectionBadge: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: 10,
      paddingVertical: 7,
      borderRadius: 18,
    },

    connectionDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginRight: 5,
    },

    connectionText: {
      fontSize: 10,
      fontWeight: "bold",
    },

    statusCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      flexDirection: "row",
      alignItems: "center",
      justifyContent:
        "space-between",
      marginBottom: 25,
      backgroundColor:
        colors.card,
    },

    statusLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    roverIcon: {
      width: 55,
      height: 55,
      borderRadius: 28,
      backgroundColor:
        colors.greenLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    statusTitle: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
    },

    statusOnline: {
      fontSize: 12,
      marginTop: 4,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: colors.text,
      marginBottom: 12,
    },

    row: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: 15,
    },

    metricCard: {
      width: "48%",
      padding: 17,
      borderRadius: 18,
      elevation: 3,
      backgroundColor:
        colors.card,
    },

    metricIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      justifyContent: "center",
      alignItems: "center",
      marginBottom: 10,
    },

    metricValue: {
      fontSize: 24,
      fontWeight: "bold",
      color: colors.text,
    },

    metricLabel: {
      fontSize: 13,
      color:
        colors.secondaryText,
      marginTop: 3,
    },

    infoCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      marginBottom: 22,
      backgroundColor:
        colors.card,
    },

    infoRow: {
      flexDirection: "row",
      alignItems: "center",
      minHeight: 52,
    },

    infoIcon: {
      width: 42,
      height: 42,
      borderRadius: 21,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 12,
    },

    infoTitle: {
      flex: 1,
      fontSize: 14,
      fontWeight: "600",
      color: colors.text,
    },

    infoValue: {
      fontSize: 12,
      color:
        colors.secondaryText,
      maxWidth: 115,
      textAlign: "right",
    },

    divider: {
      height: 1,
      backgroundColor:
        colors.divider,
    },

    modeCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 15,
      backgroundColor:
        colors.card,
    },

    modeIcon: {
      width: 50,
      height: 50,
      borderRadius: 25,
      backgroundColor:
        colors.greenLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    modeLabel: {
      fontSize: 12,
      color:
        colors.secondaryText,
    },

    modeValue: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.green,
      marginTop: 3,
    },

    modeInfo: {
      flex: 1,
    },

    cropCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
      backgroundColor:
        colors.card,
    },

    cropIcon: {
      width: 52,
      height: 52,
      borderRadius: 26,
      backgroundColor:
        colors.greenLight,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    cropInfo: {
      flex: 1,
    },

    cropTitle: {
      fontSize: 17,
      fontWeight: "bold",
      color: colors.text,
    },

    cropText: {
      fontSize: 12,
      color:
        colors.secondaryText,
      marginTop: 4,
      lineHeight: 17,
    },

    lastUpdate: {
      textAlign: "center",
      color:
        colors.mutedText,
      fontSize: 11,
      marginTop: 3,
    },

  });