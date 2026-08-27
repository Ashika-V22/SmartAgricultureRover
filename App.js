import React from "react";

import {
  NavigationContainer,
} from "@react-navigation/native";

import {
  createNativeStackNavigator,
} from "@react-navigation/native-stack";

import LoginScreen from "./screens/Auth/LoginScreen";
import RegisterScreen from "./screens/Auth/RegisterScreen";
import AppNavigator from "./navigation/AppNavigator";

import {
  ThemeProvider,
} from "./context/ThemeContext";

import {
  LanguageProvider,
} from "./context/LanguageContext";

import {
  BluetoothProvider,
} from "./context/BluetoothContext";

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <ThemeProvider>

      <LanguageProvider>

        <BluetoothProvider>

          <NavigationContainer>

            <Stack.Navigator
              initialRouteName="Login"
              screenOptions={{
                headerShown: false,
              }}
            >

              <Stack.Screen
                name="Login"
                component={LoginScreen}
              />

              <Stack.Screen
                name="Register"
                component={RegisterScreen}
              />

              <Stack.Screen
                name="MainApp"
                component={AppNavigator}
              />

            </Stack.Navigator>

          </NavigationContainer>

        </BluetoothProvider>

      </LanguageProvider>

    </ThemeProvider>
  );
}