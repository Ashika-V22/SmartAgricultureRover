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

const API_URL = "http://10.97.90.77:5000";

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (
      !name.trim() ||
      !username.trim() ||
      !email.trim() ||
      !password
    ) {
      Alert.alert(
        "Missing Information",
        "Please fill in all required fields."
      );
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert(
        "Password Error",
        "Passwords do not match."
      );
      return;
    }

    if (password.length < 6) {
      Alert.alert(
        "Password Error",
        "Password must contain at least 6 characters."
      );
      return;
    }

    try {
      setLoading(true);

      console.log("Creating account...");

      const response = await axios.post(
        `${API_URL}/register`,
        {
          name: name.trim(),
          username: username.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          password: password,
        }
      );

      console.log(
        "Register response:",
        response.data
      );

      Alert.alert(
        "Account Created!",
        "Your Smart Agriculture Rover account has been created successfully.",
        [
          {
            text: "Go to Login",
            onPress: () => {
              navigation.replace("Login");
            },
          },
        ]
      );
    } catch (error) {
      console.log("Register error:", error);

      console.log(
        "Register error response:",
        error.response?.data
      );

      const message =
        error.response?.data?.message ||
        "Unable to create your account.";

      Alert.alert(
        "Registration Failed",
        message
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === "ios"
          ? "padding"
          : "height"
      }
    >
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backText}>
            ← Back
          </Text>
        </TouchableOpacity>

        <View style={styles.logoCircle}>
          <Text style={styles.logo}>
            🌱
          </Text>
        </View>

        <Text style={styles.title}>
          Create Account
        </Text>

        <Text style={styles.subtitle}>
          Join your smart farming dashboard
        </Text>

        <View style={styles.card}>
          <Text style={styles.heading}>
            Get Started
          </Text>

          <Text style={styles.description}>
            Create your account to manage your rover.
          </Text>

          <Text style={styles.label}>
            Full Name *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter your full name"
            placeholderTextColor="#9CA3AF"
            value={name}
            onChangeText={setName}
            autoCapitalize="words"
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Username *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Choose a username"
            placeholderTextColor="#9CA3AF"
            value={username}
            onChangeText={setUsername}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Email *
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
            Phone
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Enter phone number"
            placeholderTextColor="#9CA3AF"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Password *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Create a password"
            placeholderTextColor="#9CA3AF"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="next"
          />

          <Text style={styles.label}>
            Confirm Password *
          </Text>

          <TextInput
            style={styles.input}
            placeholder="Confirm your password"
            placeholderTextColor="#9CA3AF"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <TouchableOpacity
            style={[
              styles.registerButton,
              loading && styles.disabledButton,
            ]}
            onPress={handleRegister}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator
                color="#FFFFFF"
              />
            ) : (
              <Text style={styles.registerButtonText}>
                Create Account
              </Text>
            )}
          </TouchableOpacity>

          <View style={styles.loginRow}>
            <Text style={styles.loginText}>
              Already have an account?
            </Text>

            <TouchableOpacity
              onPress={() =>
                navigation.navigate("Login")
              }
            >
              <Text style={styles.loginLink}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
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
    padding: 24,
    paddingTop: 45,
    paddingBottom: 40,
  },

  backButton: {
    marginBottom: 18,
  },

  backText: {
    color: "#2E7D32",
    fontSize: 15,
    fontWeight: "700",
  },

  logoCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: "#DDF3E0",
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 12,
  },

  logo: {
    fontSize: 34,
  },

  title: {
    textAlign: "center",
    fontSize: 27,
    fontWeight: "800",
    color: "#183A24",
  },

  subtitle: {
    textAlign: "center",
    color: "#6B7280",
    marginTop: 6,
    marginBottom: 22,
  },

  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 22,
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
    fontSize: 23,
    fontWeight: "800",
    color: "#183A24",
  },

  description: {
    color: "#6B7280",
    marginTop: 5,
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "700",
    color: "#374151",
    marginBottom: 7,
  },

  input: {
    height: 50,
    borderWidth: 1,
    borderColor: "#D1D5DB",
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: "#111827",
    marginBottom: 15,
    backgroundColor: "#FAFAFA",
  },

  registerButton: {
    height: 54,
    borderRadius: 14,
    backgroundColor: "#4CAF50",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },

  disabledButton: {
    opacity: 0.7,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "800",
  },

  loginRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 22,
    flexWrap: "wrap",
  },

  loginText: {
    color: "#6B7280",
  },

  loginLink: {
    color: "#2E7D32",
    fontWeight: "800",
    marginLeft: 5,
  },
});