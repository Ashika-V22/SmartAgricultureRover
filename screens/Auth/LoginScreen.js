import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const API_URL = "https://smartagriculturerover.onrender.com";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert(
        "Missing Information",
        "Please enter your email and password."
      );
      return;
    }

    try {
      setLoading(true);

      console.log("Logging in...");

      const response = await axios.post(`${API_URL}/login`, {
        email: email.trim().toLowerCase(),
        password: password,
      });

      console.log("Login response:", response.data);

      const user = response.data.user;

      await AsyncStorage.setItem(
        "user",
        JSON.stringify(user)
      );

      Alert.alert(
        "Welcome back!",
        `Welcome ${user.name || user.username}!`,
        [
          {
            text: "Continue",
            onPress: () => {
              navigation.replace("MainApp");
            },
          },
        ]
      );
    } catch (error) {
      console.log("Login error:", error);
      console.log(
        "Login error response:",
        error.response?.data
      );

      const message =
        error.response?.data?.message ||
        "Unable to connect to the server.";

      Alert.alert("Login Failed", message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios" ? "padding" : "height"
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.logoCircle}>
          <Text style={styles.logo}>🌱</Text>
        </View>

        <Text style={styles.title}>
          Smart Agriculture
        </Text>

        <Text style={styles.rover}>
          ROVER
        </Text>

        <Text style={styles.subtitle}>
          Intelligent farming at your fingertips
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Welcome Back
          </Text>

          <Text style={styles.description}>
            Sign in to access your rover dashboard
          </Text>

          <Text style={styles.label}>
            Email
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            placeholderTextColor="#9CA3AF"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Password
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleLogin}
          />

          <TouchableOpacity
            style={[
              styles.loginButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleLogin}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#FFFFFF" />
            ) : (
              <Text style={styles.loginButtonText}>
                Sign In
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.registerRow}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Register")
              }
            >
              <Text style={styles.registerLink}>
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <Text style={styles.footer}>
          Smart Agriculture Rover • AI Powered Farming
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8F3",
  },

  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 24,
  },

  logoCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: "#DDF3E0",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },

  logo: {
    fontSize: 42,
  },

  title: {
    textAlign: "center",
    fontSize: 28,
    fontWeight: "800",
    color: "#183A24",
  },

  rover: {
    textAlign: "center",
    fontSize: 14,
    fontWeight: "700",
    letterSpacing: 5,
    color: "#4CAF50",
    marginTop: 3,
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 14,
    marginTop: 8,
    marginBottom: 28,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 24,
    elevation: 5,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 5,
    },
  },

  heading: {
    fontSize: 25,
    fontWeight: "800",
    color: "#183A24",
  },

  description: {
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 24,
    fontSize: 14,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 13,
    paddingHorizontal: 15,
    fontSize: 15,
    color: "#111827",
    marginBottom: 18,
    backgroundColor: "#FAFAFA",
  },

  loginButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 4,
  },

  disabledButton: {
    opacity: 0.7,
  },

  loginButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  registerRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 24,
    flexWrap: "wrap",
  },

  registerText: {
    color: "#6B7280",
    fontSize: 14,
  },

  registerLink: {
    color: "#2E7D32",
    fontSize: 14,
    fontWeight: "800",
    marginLeft: 5,
  },

  footer: {
    textAlign: "center",
    color: "#9CA3AF",
    fontSize: 11,
    marginTop: 24,
  },
});