# 🌱 Smart Agriculture Rover System

An AI-powered smart agriculture rover combining robotics, IoT, and machine learning to support farming activities through seed dispensing, irrigation, environmental monitoring, GPS integration, camera functionality, and crop recommendation.

## 📌 Project Overview

The **Smart Agriculture Rover System** is an academic project developed at Atria Institute of Technology, Bengaluru, to explore the application of artificial intelligence, robotics, and IoT in agriculture.

The rover supports movement, seed dispensing, and watering. Its sensors provide selected environmental readings, while a NEO-6M GPS module is included for geographic positioning when a valid satellite fix is available.

The accompanying mobile application provides interfaces for rover control, sensor monitoring, camera functionality, crop prediction, and farming-related insights. A Flask backend connects supported application features with the crop prediction model and database services.

The project aligns with **United Nations Sustainable Development Goal 2 (Zero Hunger)** by exploring technology-assisted agricultural practices.

## ✨ Key Features

- 🚜 **Rover Movement:** Motorized movement through the rover's control system.
- 🌱 **Seed Dispensing:** Servo-assisted seed dispensing mechanism.
- 💧 **Irrigation:** Watering mechanism for agricultural applications.
- 🌡️ **Environmental Monitoring:** Soil moisture, temperature, and humidity readings from the available sensors.
- 📏 **Distance Measurement:** Ultrasonic distance sensing for obstacle detection.
- 📍 **GPS Integration:** NEO-6M GPS module for geographic positioning when satellite reception permits.
- 📷 **Camera Integration:** ESP32-CAM for image capture.
- 🤖 **AI-Based Crop Recommendation:** Machine learning model that predicts suitable crops from seven agricultural input features.
- 📱 **Android Mobile Application:** Installable Android application developed using React Native and Expo.
- 🌐 **Backend Integration:** Flask REST API and MongoDB Atlas for supported application operations.
- 🔐 **User Authentication:** Login and registration interfaces.

## 🛠️ Hardware Components

| Component | Purpose |
|---|---|
| Arduino Mega 2560 | Controls rover hardware and connected peripherals |
| ESP32-CAM | Captures images |
| NEO-6M GPS Module | Obtains geographic coordinates when a satellite fix is available |
| L298N Motor Driver | Controls the drive motors |
| DC Geared Motors | Drive the rover wheels |
| HC-05 Bluetooth Module | Supports Bluetooth communication |
| Soil Moisture Sensor | Measures soil moisture |
| DHT11 Sensor | Measures temperature and humidity |
| HC-SR04 Ultrasonic Sensor | Measures distance |
| Servo Motors | Operate the seed dispensing and other mechanical mechanisms |
| Water Pump / Irrigation Mechanism | Supports watering operations |
| Battery | Supplies power to the rover |

*Note: The actual operation of each component depends on the implemented wiring, firmware, power supply, and control logic.*

## 💻 Technology Stack

### Mobile Application
- React Native
- Expo
- JavaScript

### Backend
- Python
- Flask
- Flask-CORS
- MongoDB Atlas
- REST API

### Machine Learning
- Python
- Pandas
- NumPy
- Scikit-learn

### Hardware and Communication
- Arduino Mega 2560
- ESP32-CAM
- NEO-6M GPS
- HC-05 Bluetooth
- L298N motor driver
- Sensors and servo motors

## 🤖 AI-Based Crop Recommendation

The system includes a trained machine learning model that recommends suitable crops using agricultural and environmental parameters.

### Input Features

The model uses seven input features:

| Feature | Description |
|---|---|
| Nitrogen (N) | Nitrogen value supplied as input |
| Phosphorus (P) | Phosphorus value supplied as input |
| Potassium (K) | Potassium value supplied as input |
| Temperature | Temperature value |
| Humidity | Humidity value |
| pH | Soil pH value |
| Rainfall | Rainfall value |

### How It Works

1. The user enters the required agricultural parameters in the crop prediction interface.
2. The application sends the values to the backend prediction API.
3. The trained model processes the seven input features.
4. The model predicts a suitable crop based on patterns learned from its training dataset.
5. The prediction is returned to the application for display.

### Important Sensor Clarification

**The rover does not have physical NPK or soil pH sensors.**

Nitrogen, phosphorus, potassium, and pH values must be supplied manually by the user. Temperature, humidity, and soil moisture can be monitored through the rover's available physical sensors, but the crop prediction model requires its specified input values.

The model's seven features are based on the crop recommendation dataset. The system should not be interpreted as automatically measuring every input directly from the field.

## 📍 GPS Integration

The rover incorporates a **NEO-6M GPS module** intended to obtain geographic coordinates from GPS satellites.

GPS can support location-aware agricultural applications, including recording rover positions and mapping field activities.

A valid satellite fix is required for reliable positioning. Performance depends on satellite visibility, antenna placement, wiring, and module configuration. GPS-based field mapping and position logging are potential extensions unless implemented and verified in the current system.

## 📷 Camera Integration

The system includes an ESP32-CAM module for image capture.

Camera functionality depends on the camera configuration, firmware, network or communication setup, and the current application integration. Further image-based crop analysis can be developed as an enhancement.

## 📱 Mobile Application

The mobile application is developed using **React Native and Expo**.

The application includes the following screens:

- **Home / Dashboard:** Overview of the system.
- **Control:** Interface for rover control.
- **Sensors:** Displays available sensor readings.
- **Camera:** Camera-related functionality.
- **Crop Prediction:** Interface for entering agricultural parameters and requesting crop recommendations.
- **Insights:** Farming-related information.
- **Login / Register:** User authentication.
- **Settings:** Application preferences.
- **About:** Project information.

Feature availability depends on the current application implementation, hardware connections, and backend configuration.

### Android APK

An installable Android APK has been built and installed on an Android device for testing.

The APK allows the application to be installed without relying solely on the Expo development QR code.

**Distribution:** The APK can be published as a downloadable asset under the repository's GitHub **Releases** section. Once a release has been published, add its direct download link here.

The APK's functionality depends on the availability and configuration of the backend services it uses.

## 🌐 Backend Architecture

The backend is developed using **Python and Flask**. It exposes REST API endpoints for supported application operations and integrates with MongoDB Atlas for database-backed functionality.

### Main API Endpoints

| Endpoint | Purpose |
|---|---|
| `/predict` | Accepts crop prediction inputs and returns a model recommendation |
| `/sensors` | Supports sensor-related data operations |

The exact request methods, payload formats, and response structures are defined by the backend implementation.

### Database Configuration

The backend reads the MongoDB connection string from the `MONGO_URI` environment variable.

```python
MONGO_URI = os.getenv("MONGO_URI")
```

Configure this variable in the backend environment rather than placing database credentials directly in the source code.

The backend was deployed on Replit during development. Its current availability depends on the deployment configuration and hosting status.

## 🏗️ System Architecture

```text
                  MOBILE APPLICATION
                   React Native + Expo
                          |
                          v
                    FLASK BACKEND
                      REST API
                     /        \
                    v          v
           CROP PREDICTION   MONGODB ATLAS
                MODEL        DATABASE


                   ROVER HARDWARE
                          |
                    Arduino Mega
                          |
          +---------------+----------------+
          |               |                |
          v               v                v
      Drive Motors     Sensors and      Servo Motors
                       Peripherals     and Irrigation
          |
          +---- ESP32-CAM
          |
          +---- NEO-6M GPS
          |
          +---- HC-05 Bluetooth
```

*This is a high-level conceptual diagram. It does not imply that every hardware component communicates directly with the backend or mobile application. Actual communication paths depend on the implemented wiring, firmware, and software configuration.*

## 📂 Project Structure

The following is an illustrative overview. Update folder names and files if the repository structure changes.

```text
SmartAgricultureRover/
├── Backend/
│   └── app.py
├── assets/
├── screens/
├── components/
├── App.js
├── package.json
├── .gitignore
├── .easignore
└── README.md
```

The repository may contain additional application screens, configuration files, model-related files, and supporting resources.

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python
- Git
- An Expo-compatible development environment
- A MongoDB Atlas account if database-backed functionality is required

### 1. Clone the Repository

```bash
git clone https://github.com/Ashika-V22/SmartAgricultureRover.git
cd SmartAgricultureRover
```

### 2. Set Up the Mobile Application

Install the project dependencies:

```bash
npm install
```

Start the Expo development server:

```bash
npx expo start
```

Follow the Expo instructions to run the application on a compatible Android device or emulator.

### 3. Set Up the Backend

Open a terminal in the project directory and navigate to the backend:

```bash
cd Backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```bash
.venv\Scripts\activate
```

Install the dependencies required by the backend. For example:

```bash
pip install flask flask-cors pymongo python-dotenv
```

Additional packages may be necessary for the machine learning model or other backend functionality. Install the actual dependencies used by the current implementation.

Configure `MONGO_URI` in your backend environment if MongoDB is required. Use the entry point and startup command specified by the current backend code and deployment configuration.

**Important:** The mobile application and backend must be configured to communicate with the correct API address. Local development addresses are not automatically accessible from a physical phone or a deployed application.

## 🔐 Security

- Do not commit `.env` files, database credentials, API keys, or private signing keys.
- Keep sensitive configuration in environment variables.
- Use placeholder values in `.env.example`.
- Do not expose database connection strings in screenshots, logs, or documentation.
- Rotate any credentials that may have been exposed.
- Review repository history before publishing if sensitive files were committed previously.

## 🌍 Sustainable Development Goal

### SDG 2 — Zero Hunger

The project explores how artificial intelligence, robotics, and IoT can support agricultural activities.

Its objectives include:

- Supporting seed dispensing and irrigation.
- Monitoring selected environmental conditions.
- Providing data-driven crop recommendations.
- Exploring GPS-supported agricultural applications.
- Demonstrating the potential of technology-assisted farming.

The system is an academic prototype and does not guarantee increased crop yield or improved agricultural outcomes.

## 🔮 Future Enhancements

Potential improvements include:

- Integration of physical NPK and soil pH sensors.
- More advanced autonomous navigation.
- Improved irrigation control based on soil moisture readings.
- Camera-based crop and field analysis.
- GPS-based field mapping and rover position logging.
- Improved communication between hardware, mobile application, and backend.
- Field testing and systematic performance evaluation.

These are proposed enhancements and should not be interpreted as existing capabilities unless implemented and tested.

## 👩‍💻 Project Information

- **Project Title:** Smart Agriculture Rover System
- **Domain:** Artificial Intelligence, Machine Learning, IoT, and Robotics
- **Institution:** Atria Institute of Technology, Bengaluru
- **Program:** B.E. Artificial Intelligence and Machine Learning
- **GitHub Repository:** [Smart Agriculture Rover](https://github.com/Ashika-V22/SmartAgricultureRover)

## ⚠️ Disclaimer

This project is an academic prototype developed for educational and demonstration purposes. Crop recommendations depend on the values supplied to the trained model and the patterns learned from its training dataset. GPS functionality depends on obtaining a valid satellite fix. Real-world agricultural decisions should consider verified soil measurements, local conditions, and professional agricultural guidance.

## 📄 License

No license has been specified for this repository. Until a license is added, reuse and redistribution are subject to applicable copyright rules.
