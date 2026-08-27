import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";

import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import { useBluetooth } from "../context/BluetoothContext";

// ==================================================
// API URL
// ==================================================

const API_URL = "http://192.168.1.35:5000";

// ==================================================
// CROP PREDICTION SCREEN
// ==================================================

export default function CropPredictionScreen() {
  const { colors, isDark } = useTheme();
  const { t } = useLanguage();

  // ==================================================
  // BLUETOOTH VALUES FOR SECTION 1
  // ==================================================

  const {
    connected,
    sensorData,
  } = useBluetooth();

  // ==================================================
  // EXISTING LIVE SENSOR VALUES
  // USED BY EXISTING SECTIONS
  // ==================================================

  const [temperature, setTemperature] = useState("--");
  const [humidity, setHumidity] = useState("--");
  const [ph, setPh] = useState("--");

  const [sensorLoading, setSensorLoading] = useState(true);

  // ==================================================
  // MODE 2:
  // SENSOR + MANUAL NPK + RAINFALL
  // ==================================================

  const [sensorN, setSensorN] = useState("");
  const [sensorP, setSensorP] = useState("");
  const [sensorK, setSensorK] = useState("");
  const [sensorRainfall, setSensorRainfall] = useState("");

  // ==================================================
  // MODE 3:
  // MANUAL FULL 7 VALUES
  // ==================================================

  const [manualTemperature, setManualTemperature] =
    useState("");

  const [manualHumidity, setManualHumidity] =
    useState("");

  const [manualPh, setManualPh] =
    useState("");

  const [manualN, setManualN] =
    useState("");

  const [manualP, setManualP] =
    useState("");

  const [manualK, setManualK] =
    useState("");

  const [manualRainfall, setManualRainfall] =
    useState("");

  // ==================================================
  // PREDICTIONS
  // ==================================================

  const [sensorPrediction, setSensorPrediction] =
    useState(null);

  const [fullPrediction, setFullPrediction] =
    useState(null);

  const [manualPrediction, setManualPrediction] =
    useState(null);

  // ==================================================
  // LOADING STATES
  // ==================================================

  const [
    sensorPredictionLoading,
    setSensorPredictionLoading,
  ] = useState(false);

  const [
    fullPredictionLoading,
    setFullPredictionLoading,
  ] = useState(false);

  const [
    manualPredictionLoading,
    setManualPredictionLoading,
  ] = useState(false);

  // ==================================================
  // EXISTING FETCH LIVE SENSORS
  // KEPT FOR OTHER SECTIONS
  // ==================================================

  const fetchSensors = async () => {
    try {
      const response =
        await axios.get(
          `${API_URL}/sensors`
        );

      console.log(
        "Sensor response:",
        response.data
      );

      // Temperature

      if (
        response.data.temperature !== undefined &&
        response.data.temperature !== null &&
        !Number.isNaN(
          Number(response.data.temperature)
        )
      ) {
        setTemperature(
          String(response.data.temperature)
        );
      } else {
        setTemperature("--");
      }

      // Humidity

      if (
        response.data.humidity !== undefined &&
        response.data.humidity !== null &&
        !Number.isNaN(
          Number(response.data.humidity)
        )
      ) {
        setHumidity(
          String(response.data.humidity)
        );
      } else {
        setHumidity("--");
      }

      // pH

      if (
        response.data.ph !== undefined &&
        response.data.ph !== null &&
        !Number.isNaN(
          Number(response.data.ph)
        )
      ) {
        setPh(
          String(response.data.ph)
        );
      }

    } catch (error) {
      console.log(
        "Crop AI sensor error:",
        error.response?.data ||
          error.message
      );
    } finally {
      setSensorLoading(false);
    }
  };

  // ==================================================
  // FETCH EXISTING SENSOR DATA
  // ==================================================

  useEffect(() => {
    fetchSensors();

    const interval =
      setInterval(() => {
        fetchSensors();
      }, 5000);

    return () =>
      clearInterval(interval);

  }, []);

  // ==================================================
  // EXISTING LIVE SENSOR VALUES
  // USED BY MODE 2
  // ==================================================

  const getLiveSensorValues = () => {

    if (
      temperature === "--" ||
      humidity === "--" ||
      ph === "--" ||
      temperature === "" ||
      humidity === "" ||
      ph === ""
    ) {

      Alert.alert(
        "Sensor Values Unavailable",
        "Temperature, humidity and soil pH sensor values are not available yet."
      );

      return null;
    }

    const temp =
      Number(temperature);

    const hum =
      Number(humidity);

    const soilPh =
      Number(ph);

    if (
      Number.isNaN(temp) ||
      Number.isNaN(hum) ||
      Number.isNaN(soilPh)
    ) {

      Alert.alert(
        "Invalid Sensor Values",
        "The current sensor values are not valid numbers."
      );

      return null;
    }

    return {
      temperature: temp,
      humidity: hum,
      ph: soilPh,
    };
  };

  // ==================================================
  // MODE 1
  // SENSOR-ONLY PREDICTION
  //
  // DISPLAYED FROM REAL ROVER:
  // temperature
  // humidity
  // soil moisture
  //
  // MODEL 2 ACTUALLY USES:
  // temperature
  // humidity
  // ==================================================

  const predictFromSensors = async () => {

    // Rover must be connected

    if (!connected) {

      Alert.alert(
        "Rover Not Connected",
        "Connect to HC-05 from the Control page first."
      );

      return;
    }

    // Wait for actual Bluetooth readings

    if (
      sensorData?.temperature === null ||
      sensorData?.humidity === null
    ) {

      Alert.alert(
        "Sensor Values Unavailable",
        "Waiting for temperature and humidity values from the rover."
      );

      return;
    }

    try {

      setSensorPredictionLoading(true);

      setSensorPrediction(null);

      // =================================================
      // MODEL 2 INPUT
      // ONLY TEMPERATURE + HUMIDITY
      // =================================================

      const payload = {

        temperature:
          sensorData.temperature,

        humidity:
          sensorData.humidity,

      };

      console.log(
        "Sensor-only prediction payload:",
        payload
      );

      const response =
        await axios.post(
          `${API_URL}/predict`,
          payload
        );

      console.log(
        "Sensor-only prediction response:",
        response.data
      );

      if (response.data?.crop) {

        setSensorPrediction(
          response.data.crop
        );

      } else {

        Alert.alert(
          "Prediction Failed",
          "No crop prediction was returned."
        );
      }

    } catch (error) {

      console.log(
        "Sensor-only prediction error:",
        error.response?.data ||
          error.message
      );

      Alert.alert(
        "Prediction Failed",
        error.response?.data?.message ||
          "Unable to connect to the prediction server."
      );

    } finally {

      setSensorPredictionLoading(false);
    }
  };

  // ==================================================
  // MODE 2
  // UNCHANGED
  // ==================================================

  const predictSensorPlusManual =
    async () => {

      const sensors =
        getLiveSensorValues();

      if (!sensors) {
        return;
      }

      if (
        !sensorN.trim() ||
        !sensorP.trim() ||
        !sensorK.trim() ||
        !sensorRainfall.trim()
      ) {

        Alert.alert(
          "Missing Information",
          "Please enter N, P, K and rainfall values."
        );

        return;
      }

      const N =
        Number(sensorN);

      const P =
        Number(sensorP);

      const K =
        Number(sensorK);

      const rainfall =
        Number(sensorRainfall);

      if (
        Number.isNaN(N) ||
        Number.isNaN(P) ||
        Number.isNaN(K) ||
        Number.isNaN(rainfall)
      ) {

        Alert.alert(
          "Invalid Values",
          "Please enter valid numeric values for N, P, K and rainfall."
        );

        return;
      }

      const payload = {

        N,
        P,
        K,

        temperature:
          sensors.temperature,

        humidity:
          sensors.humidity,

        ph:
          sensors.ph,

        rainfall,

      };

      try {

        setFullPredictionLoading(true);

        setFullPrediction(null);

        console.log(
          "Sensor + manual prediction payload:",
          payload
        );

        const response =
          await axios.post(
            `${API_URL}/predict`,
            payload
          );

        console.log(
          "Sensor + manual prediction response:",
          response.data
        );

        if (response.data?.crop) {

          setFullPrediction(
            response.data.crop
          );

        } else {

          Alert.alert(
            "Prediction Failed",
            "No crop prediction was returned."
          );
        }

      } catch (error) {

        console.log(
          "Sensor + manual prediction error:",
          error.response?.data ||
            error.message
        );

        Alert.alert(
          "Prediction Failed",
          error.response?.data?.message ||
            "Unable to connect to the prediction server."
        );

      } finally {

        setFullPredictionLoading(false);
      }
    };

  // ==================================================
  // MODE 3
  // UNCHANGED
  // ==================================================

  const predictManualFull =
    async () => {

      if (
        !manualTemperature.trim() ||
        !manualHumidity.trim() ||
        !manualPh.trim() ||
        !manualN.trim() ||
        !manualP.trim() ||
        !manualK.trim() ||
        !manualRainfall.trim()
      ) {

        Alert.alert(
          "Missing Information",
          "Please enter all 7 values."
        );

        return;
      }

      const temp =
        Number(manualTemperature);

      const hum =
        Number(manualHumidity);

      const soilPh =
        Number(manualPh);

      const N =
        Number(manualN);

      const P =
        Number(manualP);

      const K =
        Number(manualK);

      const rainfall =
        Number(manualRainfall);

      if (
        Number.isNaN(temp) ||
        Number.isNaN(hum) ||
        Number.isNaN(soilPh) ||
        Number.isNaN(N) ||
        Number.isNaN(P) ||
        Number.isNaN(K) ||
        Number.isNaN(rainfall)
      ) {

        Alert.alert(
          "Invalid Values",
          "All 7 values must be valid numbers."
        );

        return;
      }

      const payload = {

        N,
        P,
        K,

        temperature:
          temp,

        humidity:
          hum,

        ph:
          soilPh,

        rainfall,

      };

      try {

        setManualPredictionLoading(true);

        setManualPrediction(null);

        console.log(
          "Manual full prediction payload:",
          payload
        );

        const response =
          await axios.post(
            `${API_URL}/predict`,
            payload
          );

        console.log(
          "Manual full prediction response:",
          response.data
        );

        if (response.data?.crop) {

          setManualPrediction(
            response.data.crop
          );

        } else {

          Alert.alert(
            "Prediction Failed",
            "No crop prediction was returned."
          );
        }

      } catch (error) {

        console.log(
          "Manual prediction error:",
          error.response?.data ||
            error.message
        );

        Alert.alert(
          "Prediction Failed",
          error.response?.data?.message ||
            "Unable to connect to the prediction server."
        );

      } finally {

        setManualPredictionLoading(false);
      }
    };

  // ==================================================
  // UI
  // ==================================================

  return (
    <KeyboardAvoidingView
      style={[
        styles.keyboardContainer,
        {
          backgroundColor:
            colors.background,
        },
      ]}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
      keyboardVerticalOffset={
        Platform.OS === "ios"
          ? 0
          : 20
      }
    >

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
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets={
          true
        }
      >

        {/* HEADER */}

        <View style={styles.header}>

          <View
            style={
              styles.headerTextContainer
            }
          >

            <Text
              style={[
                styles.title,
                {
                  color:
                    colors.green,
                },
              ]}
            >
              {t("cropAI")}
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
              {t(
                "intelligentCropRecommendation"
              )}
            </Text>

          </View>

          <View
            style={[
              styles.aiIcon,
              {
                backgroundColor:
                  colors.greenLight,
              },
            ]}
          >

            <Ionicons
              name="sparkles"
              size={28}
              color={colors.green}
            />

          </View>

        </View>

        {/* ==================================================
            EXISTING LIVE SENSOR CARD
            LEFT AS IT WAS
        ================================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          Live Rover Sensor Values
        </Text>

        <Card
          style={[
            styles.liveCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <View
            style={
              styles.liveHeader
            }
          >

            <View
              style={[
                styles.liveIndicator,
                {
                  backgroundColor:
                    colors.green,
                },
              ]}
            />

            <Text
              style={[
                styles.liveTitle,
                {
                  color:
                    colors.text,
                },
              ]}
            >
              Sensor Data
            </Text>

            <Text
              style={[
                styles.liveText,
                {
                  color:
                    colors.green,
                },
              ]}
            >
              LIVE
            </Text>

          </View>

          <View
            style={
              styles.liveGrid
            }
          >

            <LiveValue
              icon="thermometer-outline"
              label="Temperature"
              value={
                sensorLoading
                  ? "--"
                  : temperature !== "--"
                  ? `${temperature}°C`
                  : "--"
              }
              colors={colors}
            />

            <LiveValue
              icon="water-outline"
              label="Humidity"
              value={
                sensorLoading
                  ? "--"
                  : humidity !== "--"
                  ? `${humidity}%`
                  : "--"
              }
              colors={colors}
            />

            <LiveValue
              icon="flask-outline"
              label="Soil pH"
              value={
                sensorLoading
                  ? "--"
                  : ph !== "--"
                  ? ph
                  : "--"
              }
              colors={colors}
            />

          </View>

        </Card>

        {/* ==================================================
            SECTION 1
            SENSOR ONLY
            UPDATED
        ================================================== */}

        <PredictionSectionHeader
          icon="radio-outline"
          title="1. Sensor-Only Prediction"
          description="Use the live rover sensor values to get a quick crop recommendation."
          colors={colors}
        />

        <Card
          style={[
            styles.predictionCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            Temperature, humidity and soil moisture are taken
            automatically from the rover.
          </Text>

          {/* REAL BLUETOOTH TEMPERATURE */}

          <SensorMiniRow
            label="Temperature"
            value={
              sensorData?.temperature !== null
                ? `${sensorData.temperature.toFixed(
                    1
                  )}°C`
                : "--"
            }
            colors={colors}
          />

          {/* REAL BLUETOOTH HUMIDITY */}

          <SensorMiniRow
            label="Humidity"
            value={
              sensorData?.humidity !== null
                ? `${sensorData.humidity.toFixed(
                    1
                  )}%`
                : "--"
            }
            colors={colors}
          />

          {/* REAL BLUETOOTH SOIL MOISTURE */}

          <SensorMiniRow
            label="Soil Moisture"
            value={
              sensorData?.soilMoisture !== null
                ? String(
                    sensorData.soilMoisture
                  )
                : "--"
            }
            colors={colors}
          />

          <TouchableOpacity
            style={[
              styles.predictButton,
              {
                backgroundColor:
                  colors.green,
              },

              sensorPredictionLoading &&
                styles.disabledButton,
            ]}
            onPress={
              predictFromSensors
            }
            disabled={
              sensorPredictionLoading
            }
            activeOpacity={0.8}
          >

            {sensorPredictionLoading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>

                <Ionicons
                  name="sparkles"
                  size={21}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.predictButtonText
                  }
                >
                  Predict from Sensors
                </Text>

              </>

            )}

          </TouchableOpacity>

          {sensorPrediction && (

            <PredictionResult
              prediction={
                sensorPrediction
              }
              modelText="Sensor-only model"
              colors={colors}
            />

          )}

        </Card>

        {/* ==================================================
            SECTION 2
            UNCHANGED
        ================================================== */}

        <PredictionSectionHeader
          icon="leaf-outline"
          title="2. Sensor + Farm Values"
          description="Use live temperature, humidity and pH with N, P, K and rainfall entered manually."
          colors={colors}
        />

        <Card
          style={[
            styles.predictionCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            The rover provides the sensor values automatically.
            Enter the remaining crop and rainfall values.
          </Text>

          <View
            style={
              styles.sensorSummary
            }
          >

            <SensorMiniRow
              label="Temperature"
              value={
                temperature !== "--"
                  ? `${temperature}°C`
                  : "--"
              }
              colors={colors}
            />

            <SensorMiniRow
              label="Humidity"
              value={
                humidity !== "--"
                  ? `${humidity}%`
                  : "--"
              }
              colors={colors}
            />

            <SensorMiniRow
              label="Soil pH"
              value={
                ph !== "--"
                  ? ph
                  : "--"
              }
              colors={colors}
            />

          </View>

          <Text
            style={[
              styles.subHeading,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Enter Farm Values
          </Text>

          <InputField
            label="Nitrogen (N)"
            value={sensorN}
            onChangeText={setSensorN}
            placeholder="e.g. 90"
            colors={colors}
          />

          <InputField
            label="Phosphorus (P)"
            value={sensorP}
            onChangeText={setSensorP}
            placeholder="e.g. 42"
            colors={colors}
          />

          <InputField
            label="Potassium (K)"
            value={sensorK}
            onChangeText={setSensorK}
            placeholder="e.g. 43"
            colors={colors}
          />

          <InputField
            label="Rainfall (mm)"
            value={
              sensorRainfall
            }
            onChangeText={
              setSensorRainfall
            }
            placeholder="e.g. 200"
            colors={colors}
          />

          <TouchableOpacity
            style={[
              styles.predictButton,
              {
                backgroundColor:
                  colors.green,
              },

              fullPredictionLoading &&
                styles.disabledButton,
            ]}
            onPress={
              predictSensorPlusManual
            }
            disabled={
              fullPredictionLoading
            }
            activeOpacity={0.8}
          >

            {fullPredictionLoading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>

                <Ionicons
                  name="leaf"
                  size={21}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.predictButtonText
                  }
                >
                  Predict Crop
                </Text>

              </>

            )}

          </TouchableOpacity>

          {fullPrediction && (

            <PredictionResult
              prediction={
                fullPrediction
              }
              modelText="Full 7-value crop model"
              colors={colors}
            />

          )}

        </Card>

        {/* ==================================================
            SECTION 3
            UNCHANGED
        ================================================== */}

        <PredictionSectionHeader
          icon="create-outline"
          title="3. Manual 7-Value Test"
          description="Enter all seven model values manually for testing or other purposes."
          colors={colors}
        />

        <Card
          style={[
            styles.predictionCard,
            {
              backgroundColor:
                colors.card,
            },
          ]}
        >

          <Text
            style={[
              styles.cardDescription,
              {
                color:
                  colors.secondaryText,
              },
            ]}
          >
            This option does not use the rover sensors.
            Every value is entered manually.
          </Text>

          <Text
            style={[
              styles.subHeading,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Environmental Values
          </Text>

          <InputField
            label="Temperature (°C)"
            value={
              manualTemperature
            }
            onChangeText={
              setManualTemperature
            }
            placeholder="e.g. 28.5"
            colors={colors}
          />

          <InputField
            label="Humidity (%)"
            value={
              manualHumidity
            }
            onChangeText={
              setManualHumidity
            }
            placeholder="e.g. 65"
            colors={colors}
          />

          <InputField
            label="Soil pH"
            value={manualPh}
            onChangeText={
              setManualPh
            }
            placeholder="e.g. 6.5"
            colors={colors}
          />

          <Text
            style={[
              styles.subHeading,
              {
                color:
                  colors.text,
              },
            ]}
          >
            Crop Values
          </Text>

          <InputField
            label="Nitrogen (N)"
            value={manualN}
            onChangeText={
              setManualN
            }
            placeholder="e.g. 90"
            colors={colors}
          />

          <InputField
            label="Phosphorus (P)"
            value={manualP}
            onChangeText={
              setManualP
            }
            placeholder="e.g. 42"
            colors={colors}
          />

          <InputField
            label="Potassium (K)"
            value={manualK}
            onChangeText={
              setManualK
            }
            placeholder="e.g. 43"
            colors={colors}
          />

          <InputField
            label="Rainfall (mm)"
            value={
              manualRainfall
            }
            onChangeText={
              setManualRainfall
            }
            placeholder="e.g. 200"
            colors={colors}
          />

          <TouchableOpacity
            style={[
              styles.predictButton,
              {
                backgroundColor:
                  colors.green,
              },

              manualPredictionLoading &&
                styles.disabledButton,
            ]}
            onPress={
              predictManualFull
            }
            disabled={
              manualPredictionLoading
            }
            activeOpacity={0.8}
          >

            {manualPredictionLoading ? (

              <ActivityIndicator
                color="#FFFFFF"
              />

            ) : (

              <>

                <Ionicons
                  name="flask"
                  size={21}
                  color="#FFFFFF"
                />

                <Text
                  style={
                    styles.predictButtonText
                  }
                >
                  Test Full Prediction
                </Text>

              </>

            )}

          </TouchableOpacity>

          {manualPrediction && (

            <PredictionResult
              prediction={
                manualPrediction
              }
              modelText="Full 7-value crop model"
              colors={colors}
            />

          )}

        </Card>

      </ScrollView>

    </KeyboardAvoidingView>
  );
}


// ==================================================
// SECTION HEADER
// ==================================================

function PredictionSectionHeader({
  icon,
  title,
  description,
  colors,
}) {

  return (

    <View
      style={
        styles.sectionHeader
      }
    >

      <View
        style={[
          styles.sectionIcon,
          {
            backgroundColor:
              colors.greenLight,
          },
        ]}
      >

        <Ionicons
          name={icon}
          size={22}
          color={colors.green}
        />

      </View>

      <View
        style={
          styles.sectionHeaderText
        }
      >

        <Text
          style={[
            styles.sectionHeaderTitle,
            {
              color:
                colors.text,
            },
          ]}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.sectionHeaderDescription,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {description}
        </Text>

      </View>

    </View>
  );
}


// ==================================================
// LIVE SENSOR VALUE
// ==================================================

function LiveValue({
  icon,
  label,
  value,
  colors,
}) {

  return (

    <View
      style={[
        styles.liveValue,
        {
          backgroundColor:
            colors.cardSecondary,
        },
      ]}
    >

      <Ionicons
        name={icon}
        size={23}
        color={colors.green}
      />

      <Text
        style={[
          styles.liveValueLabel,
          {
            color:
              colors.secondaryText,
          },
        ]}
      >
        {label}
      </Text>

      <Text
        style={[
          styles.liveValueText,
          {
            color:
              colors.text,
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}


// ==================================================
// SENSOR MINI ROW
// ==================================================

function SensorMiniRow({
  label,
  value,
  colors,
}) {

  return (

    <View
      style={[
        styles.sensorMiniRow,
        {
          backgroundColor:
            colors.cardSecondary,
        },
      ]}
    >

      <View
        style={
          styles.sensorMiniLeft
        }
      >

        <Ionicons
          name="radio-button-on"
          size={13}
          color={colors.green}
        />

        <Text
          style={[
            styles.sensorMiniLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {label}
        </Text>

      </View>

      <Text
        style={[
          styles.sensorMiniValue,
          {
            color:
              colors.text,
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}


// ==================================================
// INPUT FIELD
// ==================================================

function InputField({
  label,
  value,
  onChangeText,
  placeholder,
  colors,
}) {

  return (

    <View
      style={
        styles.field
      }
    >

      <Text
        style={[
          styles.inputLabel,
          {
            color:
              colors.text,
          },
        ]}
      >
        {label}
      </Text>

      <TextInput
        style={[
          styles.input,
          {
            borderColor:
              colors.border,

            backgroundColor:
              colors.input,

            color:
              colors.text,
          },
        ]}
        value={value}
        onChangeText={
          onChangeText
        }
        placeholder={
          placeholder
        }
        placeholderTextColor={
          colors.mutedText
        }
        keyboardType="decimal-pad"
        returnKeyType="next"
      />

    </View>
  );
}


// ==================================================
// PREDICTION RESULT
// ==================================================

function PredictionResult({
  prediction,
  modelText,
  colors,
}) {

  return (

    <View
      style={[
        styles.resultContainer,
        {
          backgroundColor:
            colors.greenLight,
        },
      ]}
    >

      <View
        style={[
          styles.resultIcon,
          {
            backgroundColor:
              colors.card,
          },
        ]}
      >

        <Ionicons
          name="leaf"
          size={30}
          color={colors.green}
        />

      </View>

      <View
        style={
          styles.resultTextContainer
        }
      >

        <Text
          style={[
            styles.resultSmallLabel,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          Recommended Crop
        </Text>

        <Text
          style={[
            styles.resultCrop,
            {
              color:
                colors.green,
            },
          ]}
        >
          {prediction}
        </Text>

        <Text
          style={[
            styles.modelText,
            {
              color:
                colors.secondaryText,
            },
          ]}
        >
          {modelText}
        </Text>

      </View>

    </View>
  );
}


// ==================================================
// STYLES
// ==================================================

const styles =
  StyleSheet.create({

    keyboardContainer: {
      flex: 1,
    },

    container: {
      flex: 1,
    },

    content: {
      padding: 20,
      paddingBottom: 80,
    },

    header: {
      marginTop: 20,
      marginBottom: 25,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },

    headerTextContainer: {
      flex: 1,
      paddingRight: 10,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
    },

    subtitle: {
      marginTop: 5,
      fontSize: 15,
    },

    aiIcon: {
      width: 55,
      height: 55,
      borderRadius: 28,
      justifyContent: "center",
      alignItems: "center",
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
      marginTop: 5,
    },

    liveCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      marginBottom: 30,
    },

    liveHeader: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 18,
    },

    liveIndicator: {
      width: 9,
      height: 9,
      borderRadius: 5,
      marginRight: 8,
    },

    liveTitle: {
      fontSize: 16,
      fontWeight: "600",
      flex: 1,
    },

    liveText: {
      fontSize: 11,
      fontWeight: "bold",
    },

    liveGrid: {
      flexDirection: "row",
      justifyContent: "space-between",
    },

    liveValue: {
      width: "31%",
      borderRadius: 14,
      padding: 12,
      alignItems: "center",
    },

    liveValueLabel: {
      fontSize: 11,
      marginTop: 7,
      textAlign: "center",
    },

    liveValueText: {
      fontSize: 17,
      fontWeight: "bold",
      marginTop: 4,
    },

    sectionHeader: {
      flexDirection: "row",
      alignItems: "flex-start",
      marginBottom: 12,
      marginTop: 4,
    },

    sectionIcon: {
      width: 44,
      height: 44,
      borderRadius: 14,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 11,
    },

    sectionHeaderText: {
      flex: 1,
      paddingTop: 2,
    },

    sectionHeaderTitle: {
      fontSize: 18,
      fontWeight: "bold",
    },

    sectionHeaderDescription: {
      fontSize: 12,
      lineHeight: 17,
      marginTop: 3,
    },

    predictionCard: {
      padding: 18,
      borderRadius: 18,
      elevation: 3,
      marginBottom: 30,
    },

    cardDescription: {
      fontSize: 13,
      lineHeight: 19,
      marginBottom: 16,
    },

    sensorSummary: {
      marginBottom: 5,
    },

    sensorMiniRow: {
      minHeight: 43,
      borderRadius: 11,
      paddingHorizontal: 12,
      paddingVertical: 8,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: 8,
    },

    sensorMiniLeft: {
      flexDirection: "row",
      alignItems: "center",
    },

    sensorMiniLabel: {
      fontSize: 13,
      marginLeft: 8,
    },

    sensorMiniValue: {
      fontSize: 14,
      fontWeight: "bold",
    },

    subHeading: {
      fontSize: 15,
      fontWeight: "700",
      marginTop: 8,
      marginBottom: 14,
    },

    field: {
      marginBottom: 14,
    },

    inputLabel: {
      fontSize: 14,
      fontWeight: "600",
      marginBottom: 7,
    },

    input: {
      height: 48,
      borderWidth: 1,
      borderRadius: 12,
      paddingHorizontal: 14,
      fontSize: 15,
    },

    predictButton: {
      height: 55,
      borderRadius: 16,
      justifyContent: "center",
      alignItems: "center",
      flexDirection: "row",
      elevation: 4,
      marginTop: 5,
      marginBottom: 5,
    },

    disabledButton: {
      opacity: 0.7,
    },

    predictButtonText: {
      color: "#FFFFFF",
      fontSize: 16,
      fontWeight: "bold",
      marginLeft: 9,
    },

    resultContainer: {
      borderRadius: 16,
      padding: 14,
      marginTop: 15,
      flexDirection: "row",
      alignItems: "center",
    },

    resultIcon: {
      width: 58,
      height: 58,
      borderRadius: 29,
      justifyContent: "center",
      alignItems: "center",
      marginRight: 13,
    },

    resultTextContainer: {
      flex: 1,
    },

    resultSmallLabel: {
      fontSize: 12,
    },

    resultCrop: {
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 2,
      textTransform: "capitalize",
    },

    modelText: {
      fontSize: 11,
      marginTop: 3,
    },

  });