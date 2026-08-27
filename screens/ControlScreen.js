import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  ScrollView,
} from "react-native";

import { Card } from "react-native-paper";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useBluetooth } from "../context/BluetoothContext";

export default function ControlScreen() {
  const [command, setCommand] = useState("Stopped");
  const [loading, setLoading] = useState(false);

  const { colors } = useTheme();
  const { t } = useLanguage();

  // =====================================================
  // SHARED BLUETOOTH CONNECTION
  // =====================================================

  const {
    connected,
    connecting,
    connectToRover,
    disconnectRover,
    sendBluetoothCommand,
  } = useBluetooth();

  // =====================================================
  // CONNECT
  // =====================================================

  const connectBluetooth = async () => {
    const success = await connectToRover();

    if (success) {
      Alert.alert(
        "Rover Connected",
        "HC-05 connected successfully."
      );
    } else {
      Alert.alert(
        "Bluetooth Connection Failed",
        "Unable to connect to HC-05."
      );
    }
  };

  // =====================================================
  // SEND COMMAND
  // =====================================================

  const sendCommand = async (value, displayText) => {
    if (!connected) {
      Alert.alert(
        "Rover Not Connected",
        "Connect to HC-05 first."
      );

      return;
    }

    try {
      setLoading(true);

      console.log(
        "Sending Bluetooth command:",
        value
      );

      await sendBluetoothCommand(value);

      setCommand(displayText);

      console.log(
        "Command sent:",
        value
      );
    } catch (error) {
      console.log(
        "Command error:",
        error
      );

      Alert.alert(
        "Command Failed",
        "Bluetooth connection to the rover was lost."
      );
    } finally {
      setLoading(false);
    }
  };

  // =====================================================
  // DISCONNECT
  // =====================================================

  const disconnectBluetooth = async () => {
    await disconnectRover();
    setCommand("Stopped");
  };

  // =====================================================
  // UI
  // =====================================================

  return (
    <ScrollView
      style={{
        backgroundColor: colors.background,
      }}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* TITLE */}

      <Text
        style={[
          styles.title,
          { color: colors.green },
        ]}
      >
        🚜 {t("control")}
      </Text>

      <Text
        style={[
          styles.subtitle,
          { color: colors.secondaryText },
        ]}
      >
        Control your agricultural rover through Bluetooth
      </Text>

      {/* BLUETOOTH CONNECTION */}

      <Card
        style={[
          styles.bluetoothCard,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.bluetoothTitle,
            { color: colors.text },
          ]}
        >
          Rover Connection
        </Text>

        <Text
          style={[
            styles.connectionStatus,
            {
              color: connected
                ? "#4CAF50"
                : "#E53935",
            },
          ]}
        >
          {connected
            ? "● HC-05 Connected"
            : "● HC-05 Disconnected"}
        </Text>

        {!connected ? (
          <TouchableOpacity
            style={styles.connectButton}
            onPress={connectBluetooth}
            disabled={connecting}
          >
            {connecting ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text
                style={styles.connectButtonText}
              >
                Connect to Rover
              </Text>
            )}
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={styles.disconnectButton}
            onPress={disconnectBluetooth}
          >
            <Text
              style={styles.connectButtonText}
            >
              Disconnect
            </Text>
          </TouchableOpacity>
        )}
      </Card>

      {/* CURRENT COMMAND */}

      <Card
        style={[
          styles.statusCard,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.statusTitle,
            { color: colors.secondaryText },
          ]}
        >
          Current Command
        </Text>

        <Text
          style={[
            styles.command,
            { color: colors.green },
          ]}
        >
          {command}
        </Text>

        {loading && (
          <ActivityIndicator
            size="small"
            color={colors.green}
            style={styles.loader}
          />
        )}
      </Card>

      {/* MOVEMENT */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Rover Movement
      </Text>

      <View style={styles.controller}>

        {/* FORWARD */}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            sendCommand(
              "F",
              "Moving Forward"
            )
          }
        >
          <Text style={styles.arrow}>
            ↑
          </Text>
        </TouchableOpacity>

        <View style={styles.middleRow}>

          {/* LEFT */}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              sendCommand(
                "L",
                "Turning Left"
              )
            }
          >
            <Text style={styles.arrow}>
              ←
            </Text>
          </TouchableOpacity>

          {/* STOP */}

          <TouchableOpacity
            style={styles.stop}
            onPress={() =>
              sendCommand(
                "S",
                "Stopped"
              )
            }
          >
            <Text style={styles.stopText}>
              ■
            </Text>
          </TouchableOpacity>

          {/* RIGHT */}

          <TouchableOpacity
            style={styles.button}
            onPress={() =>
              sendCommand(
                "R",
                "Turning Right"
              )
            }
          >
            <Text style={styles.arrow}>
              →
            </Text>
          </TouchableOpacity>

        </View>

        {/* BACKWARD */}

        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            sendCommand(
              "B",
              "Moving Backward"
            )
          }
        >
          <Text style={styles.arrow}>
            ↓
          </Text>
        </TouchableOpacity>

      </View>

      {/* AGRICULTURE CONTROLS */}

      <Text
        style={[
          styles.sectionTitle,
          { color: colors.text },
        ]}
      >
        Agriculture Controls
      </Text>

      <Card
        style={[
          styles.agricultureCard,
          { backgroundColor: colors.card },
        ]}
      >

        {/* PLOUGH */}

        <Text
          style={[
            styles.controlLabel,
            { color: colors.text },
          ]}
        >
          🛠️ Plough
        </Text>

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              sendCommand(
                "U",
                "Plough Up"
              )
            }
          >
            <Text style={styles.actionText}>
              Plough Up
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              sendCommand(
                "D",
                "Plough Down"
              )
            }
          >
            <Text style={styles.actionText}>
              Plough Down
            </Text>
          </TouchableOpacity>

        </View>

        {/* SEEDING */}

        <Text
          style={[
            styles.controlLabel,
            { color: colors.text },
          ]}
        >
          🌱 Seed Dispenser
        </Text>

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() =>
              sendCommand(
                "O",
                "Seeding ON"
              )
            }
          >
            <Text style={styles.actionText}>
              Start Seed
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionButton,
              styles.offButton,
            ]}
            onPress={() =>
              sendCommand(
                "X",
                "Seeding OFF"
              )
            }
          >
            <Text style={styles.actionText}>
              Stop Seed
            </Text>
          </TouchableOpacity>

        </View>

        {/* WATER */}

        <Text
          style={[
            styles.controlLabel,
            { color: colors.text },
          ]}
        >
          💧 Irrigation
        </Text>

        <View style={styles.actionRow}>

          <TouchableOpacity
            style={styles.waterButton}
            onPress={() =>
              sendCommand(
                "W",
                "Water Pump ON"
              )
            }
          >
            <Text style={styles.actionText}>
              Water ON
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.waterButton,
              styles.offButton,
            ]}
            onPress={() =>
              sendCommand(
                "Q",
                "Water Pump OFF"
              )
            }
          >
            <Text style={styles.actionText}>
              Water OFF
            </Text>
          </TouchableOpacity>

        </View>

      </Card>

      {/* CONTROL MODE */}

      <Card
        style={[
          styles.modeCard,
          { backgroundColor: colors.card },
        ]}
      >
        <Text
          style={[
            styles.modeTitle,
            { color: colors.text },
          ]}
        >
          Control Mode
        </Text>

        <Text
          style={[
            styles.mode,
            { color: colors.green },
          ]}
        >
          🕹️ {t("manualControl")}
        </Text>

        <Text
          style={[
            styles.info,
            { color: colors.secondaryText },
          ]}
        >
          Rover commands are sent directly to the Arduino Mega
          through the HC-05 Bluetooth module.
        </Text>

      </Card>

    </ScrollView>
  );
}

// =====================================================
// STYLES
// =====================================================

const styles = StyleSheet.create({

  container: {
    padding: 20,
    alignItems: "center",
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: "bold",
    marginTop: 20,
  },

  subtitle: {
    marginTop: 5,
    textAlign: "center",
  },

  bluetoothCard: {
    width: "100%",
    padding: 18,
    marginTop: 20,
    alignItems: "center",
    borderRadius: 18,
  },

  bluetoothTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },

  connectionStatus: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 8,
  },

  connectButton: {
    backgroundColor: "#4CAF50",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  disconnectButton: {
    backgroundColor: "#E53935",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 15,
  },

  connectButtonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 14,
  },

  statusCard: {
    width: "100%",
    padding: 20,
    marginTop: 18,
    alignItems: "center",
    borderRadius: 18,
  },

  statusTitle: {
    fontSize: 15,
  },

  command: {
    fontSize: 22,
    fontWeight: "bold",
    marginTop: 6,
  },

  loader: {
    marginTop: 8,
  },

  sectionTitle: {
    width: "100%",
    fontSize: 19,
    fontWeight: "800",
    marginTop: 30,
    marginBottom: 8,
  },

  controller: {
    alignItems: "center",
  },

  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },

  button: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    margin: 9,
    elevation: 4,
  },

  stop: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#E53935",
    justifyContent: "center",
    alignItems: "center",
    margin: 9,
    elevation: 4,
  },

  arrow: {
    fontSize: 38,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  stopText: {
    fontSize: 28,
    color: "#FFFFFF",
    fontWeight: "bold",
  },

  agricultureCard: {
    width: "100%",
    padding: 18,
    borderRadius: 18,
  },

  controlLabel: {
    fontSize: 16,
    fontWeight: "800",
    marginTop: 10,
    marginBottom: 8,
  },

  actionRow: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    marginBottom: 14,
  },

  actionButton: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "#4CAF50",
    borderRadius: 12,
    alignItems: "center",
  },

  waterButton: {
    width: "48%",
    paddingVertical: 14,
    backgroundColor: "#2196F3",
    borderRadius: 12,
    alignItems: "center",
  },

  offButton: {
    backgroundColor: "#E53935",
  },

  actionText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 14,
  },

  modeCard: {
    marginTop: 25,
    width: "100%",
    padding: 20,
    alignItems: "center",
    borderRadius: 18,
  },

  modeTitle: {
    fontSize: 17,
    fontWeight: "bold",
  },

  mode: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
  },

  info: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 12,
  },

});