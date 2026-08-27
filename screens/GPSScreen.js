import React from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from "react-native";

import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { useBluetooth } from "../context/BluetoothContext";


export default function GPSScreen() {

  const { t } = useLanguage();

  const { colors, isDark } = useTheme();

  // ==========================================
  // GPS COMES DIRECTLY FROM HC-05
  // ==========================================

  const {
    gpsData,
    connected,
  } = useBluetooth();


  // ==========================================
  // CHECK IF VALID GPS EXISTS
  // ==========================================

  const gpsAvailable =
    connected &&
    gpsData &&
    gpsData.latitude !== null &&
    gpsData.longitude !== null;


  return (

    <ScrollView

      style={[
        styles.container,
        {
          backgroundColor:
            colors.background,
        },
      ]}

      contentContainerStyle={
        styles.content
      }

      showsVerticalScrollIndicator={
        false
      }

    >


      {/* =====================================
          HEADER
      ===================================== */}

      <Text
        style={[
          styles.title,
          {
            color:
              colors.green,
          },
        ]}
      >

        {t("gpsLocation")}

      </Text>


      <Text
        style={[
          styles.subtitle,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >

        {t("neo6mGPSMonitoring")}

      </Text>



      {/* =====================================
          BLUETOOTH STATUS
      ===================================== */}

      <Card
        style={[
          styles.bluetoothCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >

        <Ionicons

          name={
            connected
              ? "bluetooth"
              : "bluetooth-outline"
          }

          size={27}

          color={
            connected
              ? colors.blue
              : colors.orange
          }

        />


        <View
          style={
            styles.bluetoothInfo
          }
        >

          <Text
            style={[
              styles.bluetoothLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >

            Rover Connection

          </Text>


          <Text
            style={[
              styles.bluetoothValue,
              {
                color:
                  connected
                    ? colors.green
                    : colors.orange,
              },
            ]}
          >

            {connected
              ? "HC-05 Connected"
              : "HC-05 Disconnected"}

          </Text>

        </View>

      </Card>



      {/* =====================================
          GPS STATUS
      ===================================== */}

      <Card
        style={[
          styles.statusCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >

        <View
          style={[
            styles.statusIcon,
            {
              backgroundColor:
                gpsAvailable
                  ? colors.greenLight
                  : isDark
                  ? "#3A2B1B"
                  : "#FFF3E0",
            },
          ]}
        >

          <Ionicons

            name={
              gpsAvailable
                ? "location"
                : "location-outline"
            }

            size={30}

            color={
              gpsAvailable
                ? colors.green
                : colors.orange
            }

          />

        </View>


        <View
          style={
            styles.statusInfo
          }
        >

          <Text
            style={[
              styles.statusTitle,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >

            {t("gpsStatus")}

          </Text>


          <Text
            style={[
              styles.statusValue,
              {
                color:
                  gpsAvailable
                    ? colors.green
                    : colors.orange,
              },
            ]}
          >

            {!connected
              ? "Connect HC-05"
              : gpsAvailable
              ? t("gpsConnected")
              : t("waitingForGPS")}

          </Text>

        </View>


        <View
          style={[
            styles.statusDot,
            {
              backgroundColor:
                gpsAvailable
                  ? colors.green
                  : colors.orange,
            },
          ]}
        />

      </Card>



      {/* =====================================
          COORDINATES
      ===================================== */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              colors.text,
          },
        ]}
      >

        {t("coordinates")}

      </Text>


      <Card
        style={[
          styles.coordinateCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >

        <Coordinate

          icon="navigate-outline"

          label={
            t("latitude")
          }

          value={
            gpsAvailable
              ? `${Number(
                  gpsData.latitude
                ).toFixed(6)}°`
              : "--"
          }

          colors={
            colors
          }

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


        <Coordinate

          icon="navigate-outline"

          label={
            t("longitude")
          }

          value={
            gpsAvailable
              ? `${Number(
                  gpsData.longitude
                ).toFixed(6)}°`
              : "--"
          }

          colors={
            colors
          }

        />

      </Card>



      {/* =====================================
          SATELLITE INFORMATION
      ===================================== */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              colors.text,
          },
        ]}
      >

        {t("satelliteInformation")}

      </Text>


      <View
        style={
          styles.row
        }
      >


        {/* SATELLITES */}

        <Card
          style={[
            styles.smallCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Ionicons

            name="radio-outline"

            size={30}

            color={
              colors.blue
            }

          />


          <Text
            style={[
              styles.smallValue,
              {
                color:
                  colors.text,
              },
            ]}
          >

            {gpsAvailable
              ? gpsData.satellites
              : "--"}

          </Text>


          <Text
            style={[
              styles.smallLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >

            {t("satellites")}

          </Text>

        </Card>



        {/* ALTITUDE */}

        <Card
          style={[
            styles.smallCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Ionicons

            name="speedometer-outline"

            size={30}

            color={
              colors.purple
            }

          />


          <Text
            style={[
              styles.smallValue,
              {
                color:
                  colors.text,
              },
            ]}
          >

            {gpsAvailable &&
            gpsData.altitude !== null

              ? `${Number(
                  gpsData.altitude
                ).toFixed(2)} m`

              : "--"}

          </Text>


          <Text
            style={[
              styles.smallLabel,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >

            {t("altitude")}

          </Text>

        </Card>

      </View>



      {/* =====================================
          LIVE LOCATION
      ===================================== */}

      <Text
        style={[
          styles.sectionTitle,
          {
            color:
              colors.text,
          },
        ]}
      >

        {t("locationMap")}

      </Text>


      <Card
        style={[
          styles.mapCard,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >

        <Ionicons

          name="map-outline"

          size={55}

          color={
            colors.green
          }

        />


        <Text
          style={[
            styles.mapTitle,
            {
              color:
                colors.text,
            },
          ]}
        >

          {gpsAvailable
            ? t("roverLocationAvailable")
            : t("waitingForGPSSignal")}

        </Text>


        {gpsAvailable ? (

          <>

            <Text
              style={[
                styles.mapCoordinates,
                {
                  color:
                    colors.green,
                },
              ]}
            >

              {Number(
                gpsData.latitude
              ).toFixed(6)}

              {" , "}

              {Number(
                gpsData.longitude
              ).toFixed(6)}

            </Text>


            <Text
              style={[
                styles.mapText,
                {
                  color:
                    colors.secondaryText,
                },
              ]}
            >

              Live coordinates received
              from the rover through HC-05.

            </Text>

          </>

        ) : (

          <Text
            style={[
              styles.mapText,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >

            {!connected
              ? "Connect the app to HC-05 to receive the rover location."
              : t("mapWillDisplayLocation")}

          </Text>

        )}

      </Card>



      {/* =====================================
          LAST GPS UPDATE
      ===================================== */}

      <Text
        style={[
          styles.lastUpdate,
          {
            color:
              colors.mutedText,
          },
        ]}
      >

        {t("lastGPSUpdate")}:{" "}

        {gpsData?.timestamp

          ? new Date(
              gpsData.timestamp
            ).toLocaleTimeString()

          : "--"}

      </Text>


    </ScrollView>
  );
}



/* ==========================================
   COORDINATE COMPONENT
========================================== */

function Coordinate({

  icon,

  label,

  value,

  colors,

}) {

  return (

    <View
      style={
        styles.coordinateRow
      }
    >

      <View
        style={[
          styles.coordinateIcon,
          {
            backgroundColor:
              colors.greenLight,
          },
        ]}
      >

        <Ionicons

          name={
            icon
          }

          size={23}

          color={
            colors.green
          }

        />

      </View>


      <Text
        style={[
          styles.coordinateLabel,
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
          styles.coordinateValue,
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



/* ==========================================
   STYLES
========================================== */

const styles =
  StyleSheet.create({

    container: {

      flex: 1,

    },


    content: {

      padding: 20,

      paddingBottom: 40,

    },


    title: {

      fontSize: 27,

      fontWeight: "bold",

      marginTop: 20,

    },


    subtitle: {

      marginTop: 5,

      marginBottom: 22,

    },


    // ======================================
    // BLUETOOTH
    // ======================================

    bluetoothCard: {

      padding: 16,

      borderRadius: 18,

      elevation: 3,

      flexDirection: "row",

      alignItems: "center",

      marginBottom: 15,

    },


    bluetoothInfo: {

      marginLeft: 13,

    },


    bluetoothLabel: {

      fontSize: 12,

    },


    bluetoothValue: {

      fontSize: 15,

      fontWeight: "bold",

      marginTop: 3,

    },


    // ======================================
    // GPS STATUS
    // ======================================

    statusCard: {

      padding: 18,

      borderRadius: 18,

      elevation: 3,

      flexDirection: "row",

      alignItems: "center",

      marginBottom: 25,

    },


    statusIcon: {

      width: 55,

      height: 55,

      borderRadius: 28,

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


    statusValue: {

      fontSize: 17,

      fontWeight: "bold",

      marginTop: 4,

    },


    statusDot: {

      width: 11,

      height: 11,

      borderRadius: 6,

    },


    // ======================================
    // SECTIONS
    // ======================================

    sectionTitle: {

      fontSize: 18,

      fontWeight: "bold",

      marginBottom: 12,

    },


    // ======================================
    // COORDINATES
    // ======================================

    coordinateCard: {

      padding: 18,

      borderRadius: 18,

      elevation: 3,

      marginBottom: 25,

    },


    coordinateRow: {

      minHeight: 55,

      flexDirection: "row",

      alignItems: "center",

    },


    coordinateIcon: {

      width: 42,

      height: 42,

      borderRadius: 21,

      justifyContent: "center",

      alignItems: "center",

      marginRight: 12,

    },


    coordinateLabel: {

      flex: 1,

      fontSize: 15,

      fontWeight: "600",

    },


    coordinateValue: {

      fontSize: 14,

      fontWeight: "600",

    },


    divider: {

      height: 1,

    },


    // ======================================
    // SATELLITES
    // ======================================

    row: {

      flexDirection: "row",

      justifyContent: "space-between",

      marginBottom: 25,

    },


    smallCard: {

      width: "48%",

      padding: 20,

      borderRadius: 18,

      elevation: 3,

      alignItems: "center",

    },


    smallValue: {

      fontSize: 24,

      fontWeight: "bold",

      marginTop: 10,

    },


    smallLabel: {

      marginTop: 3,

    },


    // ======================================
    // LOCATION
    // ======================================

    mapCard: {

      minHeight: 210,

      borderRadius: 18,

      elevation: 3,

      justifyContent: "center",

      alignItems: "center",

      padding: 25,

      marginBottom: 15,

    },


    mapTitle: {

      fontSize: 18,

      fontWeight: "bold",

      marginTop: 15,

      textAlign: "center",

    },


    mapCoordinates: {

      fontSize: 16,

      fontWeight: "bold",

      marginTop: 10,

      textAlign: "center",

    },


    mapText: {

      fontSize: 13,

      textAlign: "center",

      marginTop: 8,

      lineHeight: 19,

    },


    // ======================================
    // LAST UPDATE
    // ======================================

    lastUpdate: {

      textAlign: "center",

      fontSize: 11,

      marginTop: 5,

    },

  });