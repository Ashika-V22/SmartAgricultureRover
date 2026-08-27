import React, {
    createContext,
    useContext,
    useEffect,
    useState,
  } from "react";
  
  import AsyncStorage from "@react-native-async-storage/async-storage";
  
  const LanguageContext = createContext();
  
  const translations = {
    English: {
      settings: "Settings",
      managePreferences:
        "Manage your rover and account preferences",
  
      account: "Account",
      language: "Language",
      applicationLanguage: "Application language",
  
      theme: "Theme",
      applicationAppearance:
        "Application appearance",
  
      notifications: "Notifications",
      roverAlerts: "Rover Alerts",
      unusualSensorReadings:
        "Receive alerts for unusual sensor readings",
  
      rover: "Rover",
      connection: "Connection",
      backendCommunication:
        "Backend communication status",
      connected: "Connected",
  
      logout: "Logout",
      logoutConfirm:
        "Are you sure you want to logout?",
      cancel: "Cancel",
  
      home: "Home",
      control: "Control",
      sensors: "Sensors",
      gps: "GPS",
      alerts: "Alerts",
      cropAI: "Crop AI",
      camera: "Camera",
  
      smartAgricultureRover:
        "Smart Agriculture Rover",
      intelligentFarmingAssistant:
        "Intelligent Farming Assistant",
  
      liveOverview: "Live Overview",
      temperature: "Temperature",
      humidity: "Humidity",
      soilMoisture: "Soil Moisture",
      battery: "Battery",
  
      soilSafety: "Soil & Safety",
      soilPH: "Soil pH",
      obstacleDetection:
        "Obstacle Detection",
  
      currentMode: "Current Mode",
      manualControl: "Manual Control",
  
      light: "Light",
      dark: "Dark",
      system: "System",
  
      english: "English",
      kannada: "Kannada",
      hindi: "Hindi",
  
      online: "ONLINE",
      roverStatus: "Rover Status",
      connectedToBackend:
        "Connected to backend",
      waitingForSensor:
        "Waiting for sensor",
      hcSr04Ready: "HC-SR04 ready",
      neo6mReady: "NEO-6M ready",
  
      cropDescription:
        "Get an intelligent crop recommendation using your soil and environmental data.",
  
      lastSensorUpdate:
        "Last sensor update",
  
      gpsLocation: "GPS Location",
      neo6mGPSMonitoring:
        "NEO-6M GPS monitoring",
  
      gpsStatus: "GPS Status",
      gpsConnected: "GPS Connected",
      waitingForGPS: "Waiting for GPS",
  
      coordinates: "Coordinates",
      latitude: "Latitude",
      longitude: "Longitude",
  
      satelliteInformation:
        "Satellite Information",
      satellites: "Satellites",
      altitude: "Altitude",
  
      locationMap: "Location Map",
      roverLocationAvailable:
        "Rover Location Available",
      waitingForGPSSignal:
        "Waiting for GPS Signal",
  
      gpsCoordinatesAvailable:
        "The rover's current GPS coordinates are available.",
  
      mapWillDisplayLocation:
        "The map will display the rover location once the NEO-6M receives a valid GPS signal.",
  
      lastGPSUpdate:
        "Last GPS update",
    },
  
    Kannada: {
      settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
      managePreferences:
        "ನಿಮ್ಮ ರೋವರ್ ಮತ್ತು ಖಾತೆಯ ಆದ್ಯತೆಗಳನ್ನು ನಿರ್ವಹಿಸಿ",
  
      account: "ಖಾತೆ",
      language: "ಭಾಷೆ",
      applicationLanguage:
        "ಅಪ್ಲಿಕೇಶನ್ ಭಾಷೆ",
  
      theme: "ಥೀಮ್",
      applicationAppearance:
        "ಅಪ್ಲಿಕೇಶನ್ ವಿನ್ಯಾಸ",
  
      notifications: "ಅಧಿಸೂಚನೆಗಳು",
      roverAlerts: "ರೋವರ್ ಎಚ್ಚರಿಕೆಗಳು",
      unusualSensorReadings:
        "ಅಸಾಮಾನ್ಯ ಸೆನ್ಸರ್ ಮಾಹಿತಿಗಾಗಿ ಎಚ್ಚರಿಕೆಗಳನ್ನು ಪಡೆಯಿರಿ",
  
      rover: "ರೋವರ್",
      connection: "ಸಂಪರ್ಕ",
      backendCommunication:
        "ಬ್ಯಾಕೆಂಡ್ ಸಂಪರ್ಕ ಸ್ಥಿತಿ",
      connected: "ಸಂಪರ್ಕಗೊಂಡಿದೆ",
  
      logout: "ಲಾಗ್‌ಔಟ್",
      logoutConfirm:
        "ನೀವು ಲಾಗ್‌ಔಟ್ ಮಾಡಲು ಖಚಿತವಾಗಿದ್ದೀರಾ?",
      cancel: "ರದ್ದುಮಾಡಿ",
  
      home: "ಹೋಮ್",
      control: "ನಿಯಂತ್ರಣ",
      sensors: "ಸೆನ್ಸರ್‌ಗಳು",
      gps: "GPS",
      alerts: "ಎಚ್ಚರಿಕೆಗಳು",
      cropAI: "ಬೆಳೆ AI",
      camera: "ಕ್ಯಾಮೆರಾ",
  
      smartAgricultureRover:
        "ಸ್ಮಾರ್ಟ್ ಕೃಷಿ ರೋವರ್",
      intelligentFarmingAssistant:
        "ಬುದ್ಧಿವಂತ ಕೃಷಿ ಸಹಾಯಕ",
  
      liveOverview: "ಲೈವ್ ಮಾಹಿತಿ",
      temperature: "ತಾಪಮಾನ",
      humidity: "ತೇವಾಂಶ",
      soilMoisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ",
      battery: "ಬ್ಯಾಟರಿ",
  
      soilSafety: "ಮಣ್ಣು ಮತ್ತು ಸುರಕ್ಷತೆ",
      soilPH: "ಮಣ್ಣಿನ pH",
      obstacleDetection:
        "ಅಡಚಣೆ ಪತ್ತೆ",
  
      currentMode: "ಪ್ರಸ್ತುತ ಮೋಡ್",
      manualControl:
        "ಮ್ಯಾನುಯಲ್ ನಿಯಂತ್ರಣ",
  
      light: "ಲೈಟ್",
      dark: "ಡಾರ್ಕ್",
      system: "ಸಿಸ್ಟಮ್",
  
      english: "ಇಂಗ್ಲಿಷ್",
      kannada: "ಕನ್ನಡ",
      hindi: "ಹಿಂದಿ",
  
      online: "ಆನ್‌ಲೈನ್",
      roverStatus: "ರೋವರ್ ಸ್ಥಿತಿ",
      connectedToBackend:
        "ಬ್ಯಾಕೆಂಡ್‌ಗೆ ಸಂಪರ್ಕಗೊಂಡಿದೆ",
      waitingForSensor:
        "ಸೆನ್ಸರ್‌ಗಾಗಿ ಕಾಯುತ್ತಿದೆ",
      hcSr04Ready:
        "HC-SR04 ಸಿದ್ಧವಾಗಿದೆ",
      neo6mReady:
        "NEO-6M ಸಿದ್ಧವಾಗಿದೆ",
  
      cropDescription:
        "ನಿಮ್ಮ ಮಣ್ಣು ಮತ್ತು ಪರಿಸರದ ಮಾಹಿತಿಯನ್ನು ಬಳಸಿ ಬುದ್ಧಿವಂತ ಬೆಳೆ ಶಿಫಾರಸು ಪಡೆಯಿರಿ.",
  
      lastSensorUpdate:
        "ಕೊನೆಯ ಸೆನ್ಸರ್ ನವೀಕರಣ",
  
      gpsLocation: "GPS ಸ್ಥಳ",
      neo6mGPSMonitoring:
        "NEO-6M GPS ಮೇಲ್ವಿಚಾರಣೆ",
  
      gpsStatus: "GPS ಸ್ಥಿತಿ",
      gpsConnected:
        "GPS ಸಂಪರ್ಕಗೊಂಡಿದೆ",
      waitingForGPS:
        "GPS ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
  
      coordinates: "ನಿರ್ದೇಶಾಂಕಗಳು",
      latitude: "ಅಕ್ಷಾಂಶ",
      longitude: "ರೇಖಾಂಶ",
  
      satelliteInformation:
        "ಉಪಗ್ರಹ ಮಾಹಿತಿ",
      satellites: "ಉಪಗ್ರಹಗಳು",
      altitude: "ಎತ್ತರ",
  
      locationMap: "ಸ್ಥಳ ನಕ್ಷೆ",
      roverLocationAvailable:
        "ರೋವರ್ ಸ್ಥಳ ಲಭ್ಯವಿದೆ",
      waitingForGPSSignal:
        "GPS ಸಿಗ್ನಲ್‌ಗಾಗಿ ಕಾಯಲಾಗುತ್ತಿದೆ",
  
      gpsCoordinatesAvailable:
        "ರೋವರ್‌ನ ಪ್ರಸ್ತುತ GPS ನಿರ್ದೇಶಾಂಕಗಳು ಲಭ್ಯವಿವೆ.",
  
      mapWillDisplayLocation:
        "NEO-6M ಮಾನ್ಯ GPS ಸಿಗ್ನಲ್ ಪಡೆದ ನಂತರ ನಕ್ಷೆಯಲ್ಲಿ ರೋವರ್ ಸ್ಥಳವನ್ನು ತೋರಿಸಲಾಗುತ್ತದೆ.",
  
      lastGPSUpdate:
        "ಕೊನೆಯ GPS ನವೀಕರಣ",
    },
  
    Hindi: {
      settings: "सेटिंग्स",
      managePreferences:
        "अपने रोवर और अकाउंट की प्राथमिकताएँ प्रबंधित करें",
  
      account: "अकाउंट",
      language: "भाषा",
      applicationLanguage:
        "एप्लिकेशन भाषा",
  
      theme: "थीम",
      applicationAppearance:
        "एप्लिकेशन का स्वरूप",
  
      notifications: "सूचनाएँ",
      roverAlerts: "रोवर अलर्ट",
      unusualSensorReadings:
        "असामान्य सेंसर रीडिंग के लिए अलर्ट प्राप्त करें",
  
      rover: "रोवर",
      connection: "कनेक्शन",
      backendCommunication:
        "बैकएंड संचार स्थिति",
      connected: "कनेक्टेड",
  
      logout: "लॉगआउट",
      logoutConfirm:
        "क्या आप लॉगआउट करना चाहते हैं?",
      cancel: "रद्द करें",
  
      home: "होम",
      control: "कंट्रोल",
      sensors: "सेंसर",
      gps: "GPS",
      alerts: "अलर्ट",
      cropAI: "क्रॉप AI",
      camera: "कैमरा",
  
      smartAgricultureRover:
        "स्मार्ट एग्रीकल्चर रोवर",
      intelligentFarmingAssistant:
        "इंटेलिजेंट फार्मिंग असिस्टेंट",
  
      liveOverview: "लाइव जानकारी",
      temperature: "तापमान",
      humidity: "नमी",
      soilMoisture: "मिट्टी की नमी",
      battery: "बैटरी",
  
      soilSafety: "मिट्टी और सुरक्षा",
      soilPH: "मिट्टी का pH",
      obstacleDetection:
        "बाधा पहचान",
  
      currentMode: "वर्तमान मोड",
      manualControl:
        "मैनुअल कंट्रोल",
  
      light: "लाइट",
      dark: "डार्क",
      system: "सिस्टम",
  
      english: "अंग्रेज़ी",
      kannada: "कन्नड़",
      hindi: "हिंदी",
  
      online: "ऑनलाइन",
      roverStatus: "रोवर स्थिति",
      connectedToBackend:
        "बैकएंड से कनेक्टेड",
      waitingForSensor:
        "सेंसर की प्रतीक्षा",
      hcSr04Ready:
        "HC-SR04 तैयार",
      neo6mReady:
        "NEO-6M तैयार",
  
      cropDescription:
        "अपने मिट्टी और पर्यावरण के डेटा का उपयोग करके बुद्धिमान फसल की सिफारिश प्राप्त करें।",
  
      lastSensorUpdate:
        "अंतिम सेंसर अपडेट",
  
      gpsLocation: "GPS स्थान",
      neo6mGPSMonitoring:
        "NEO-6M GPS निगरानी",
  
      gpsStatus: "GPS स्थिति",
      gpsConnected:
        "GPS कनेक्टेड",
      waitingForGPS:
        "GPS सिग्नल की प्रतीक्षा",
  
      coordinates: "निर्देशांक",
      latitude: "अक्षांश",
      longitude: "देशांतर",
  
      satelliteInformation:
        "सैटेलाइट जानकारी",
      satellites: "सैटेलाइट",
      altitude: "ऊँचाई",
  
      locationMap: "स्थान मानचित्र",
      roverLocationAvailable:
        "रोवर का स्थान उपलब्ध है",
      waitingForGPSSignal:
        "GPS सिग्नल की प्रतीक्षा",
  
      gpsCoordinatesAvailable:
        "रोवर के वर्तमान GPS निर्देशांक उपलब्ध हैं।",
  
      mapWillDisplayLocation:
        "NEO-6M को वैध GPS सिग्नल मिलने के बाद मानचित्र पर रोवर का स्थान दिखाई देगा।",
  
      lastGPSUpdate:
        "अंतिम GPS अपडेट",
    },
  };
  
  export function LanguageProvider({ children }) {
    const [language, setLanguage] =
      useState("English");
  
    useEffect(() => {
      loadLanguage();
    }, []);
  
    const loadLanguage = async () => {
      try {
        const savedLanguage =
          await AsyncStorage.getItem("language");
  
        if (savedLanguage) {
          setLanguage(savedLanguage);
        }
      } catch (error) {
        console.log(
          "Language loading error:",
          error
        );
      }
    };
  
    const changeLanguage = async (
      newLanguage
    ) => {
      try {
        setLanguage(newLanguage);
  
        await AsyncStorage.setItem(
          "language",
          newLanguage
        );
      } catch (error) {
        console.log(
          "Language saving error:",
          error
        );
      }
    };
  
    const t = (key) => {
      return (
        translations[language]?.[key] ||
        translations.English[key] ||
        key
      );
    };
  
    return (
      <LanguageContext.Provider
        value={{
          language,
          changeLanguage,
          t,
        }}
      >
        {children}
      </LanguageContext.Provider>
    );
  }
  
  export function useLanguage() {
    return useContext(LanguageContext);
  }