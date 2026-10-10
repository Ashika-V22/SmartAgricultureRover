# 🌱 Smart Agriculture Rover System

An AI-powered smart agriculture rover that combines robotics, IoT, and machine learning to support farming activities through seed dispensing, irrigation, environmental monitoring, GPS integration, and crop recommendation.

## 📌 Project Overview

The **Smart Agriculture Rover System** is an academic project developed to explore the use of artificial intelligence, robotics, and IoT in modern agriculture.

The rover supports farming operations such as movement, seed dispensing, and watering. Its sensors monitor selected environmental conditions, while a GPS module provides location data when a satellite fix is available.

A trained machine learning model recommends suitable crops using agricultural and environmental parameters. The accompanying mobile application provides an interface for rover control, sensor monitoring, crop prediction, camera functionality, and farming-related insights.

The project aligns with **United Nations Sustainable Development Goal 2 (Zero Hunger)** by exploring technology-assisted agricultural practices.

## ✨ Key Features

- 🚜 **Rover Movement:** Motorized movement controlled through the rover's control system.
- 🌱 **Seed Dispensing:** Servo-assisted mechanism for dispensing seeds.
- 💧 **Irrigation:** Watering mechanism to support agricultural activities.
- 🌡️ **Environmental Monitoring:** Soil moisture, temperature, and humidity readings using available sensors.
- 📏 **Distance Measurement:** Ultrasonic sensing for distance measurement and obstacle detection.
- 📍 **GPS Integration:** NEO-6M GPS module for obtaining geographic location data when a satellite fix is available.
- 📷 **Camera Integration:** ESP32-CAM support for image capture.
- 🤖 **AI-Based Crop Recommendation:** A trained machine learning model predicts suitable crops using seven agricultural input features.
- 📱 **Mobile Application:** An interface for rover control, sensor monitoring, crop prediction, and other project features.
- 🌐 **Backend Integration:** Flask REST API and MongoDB Atlas integration for supported application operations.

## 🛠️ Hardware Components

| Component | Purpose |
|---|---|
| Arduino Mega 2560 | Controls the rover's hardware |
| ESP32-CAM | Captures images |
| NEO-6M GPS Module | Provides geographic location data when a satellite fix is available |
| L298N Motor Driver | Controls the DC motors |
| DC Geared Motors | Drive the rover wheels |
| HC-05 Bluetooth Module | Enables Bluetooth communication |
| Soil Moisture Sensor | Measures soil moisture |
| DHT11 Sensor | Measures temperature and humidity |
| HC-SR04 Ultrasonic Sensor | Measures distance for obstacle detection |
| Servo Motors | Operate the seed dispensing and other mechanical mechanisms |
| Water Pump / Irrigation Mechanism | Supports watering operations |
| Battery | Supplies power to the rover |

*Note: Actual component behavior depends on the implemented wiring, firmware, and control logic.*

## 💻 Technology Stack

### Mobile Application
- React Native
- Expo
- JavaScript

### Backend
- Python
- Flask
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
- NEO-6M GPS Module
- HC-05 Bluetooth Module
- Motor driver, sensors, and servo motors

## 🤖 AI-Based Crop Recommendation

The system includes a trained machine learning model that recommends suitable crops based on agricultural and environmental parameters.

### Input Features

The model uses seven features:

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

1. The user provides the required input values through the crop prediction interface.
2. The application sends the input parameters to the backend prediction API.
3. The trained machine learning model processes the seven features.
4. The model predicts a suitable crop based on patterns learned from the training dataset.
5. The predicted crop is returned to the application and displayed to the user.

### Important Sensor Clarification

The rover does **not** have a physical NPK sensor or soil pH sensor. These values can be entered manually by the user along with the other required model inputs.

The model is trained to use all seven features and can make predictions using the supplied values without requiring the rover itself to measure NPK or pH.

The rover's physical sensors separately support environmental monitoring, including soil moisture, temperature, and humidity. The crop recommendation model and the rover's sensor system serve complementary purposes.

## 📍 GPS Integration

The rover incorporates a **NEO-6M GPS module** intended to obtain geographic coordinates from GPS satellites.

GPS functionality can support future location-aware agricultural applications, such as recording rover positions and mapping field activities.

GPS performance depends on satellite visibility, antenna placement, wiring, and module configuration. A valid satellite fix is required before reliable location coordinates can be obtained.

## 📱 Mobile Application

The mobile application is developed using React Native and Expo.

Its screens include:

- **Home / Dashboard:** Overview of the system.
- **Control:** Interface for controlling the rover.
- **Sensors:** Displays available sensor readings.
- **Camera:** Camera-related functionality.
- **Crop Prediction:** Interface for entering crop parameters and requesting predictions.
- **Insights:** Farming-related information.
- **Login / Register:** User authentication.
- **Settings:** Application preferences.
- **About:** Project information.

Feature availability depends on the current application, hardware, and backend configuration.

## 🌐 Backend Architecture

The backend is developed using Flask and provides REST API endpoints for application operations.

### Main API Endpoints

| Endpoint | Purpose |
|---|---|
| `/predict` | Accepts crop prediction inputs and returns a model recommendation |
| `/sensors` | Supports sensor-related data operations |

The backend uses MongoDB Atlas for supported database operations. The database connection string is configured through the `MONGO_URI` environment variable.

```python
MONGO_URI = os.getenv("MONGO_URI")
```

The backend has been deployed on Replit during development. Its availability depends on the current deployment configuration.

## 🏗️ System Architecture

```text
                ┌────────────────────────┐
                │   Mobile Application   │
                │   React Native + Expo  │
                └───────────┬────────────┘
                            │
                ┌───────────▼────────────┐
                │      Flask Backend     │
                │       REST API         │
                └────────┬────────┬──────┘
                         │        │
                ┌────────▼───┐ ┌──▼───────────┐
                │ Crop       │ │ MongoDB Atlas│
                │ Prediction │ │   Database   │
                │ Model      │ └──────────────┘
                └────────────┘


                ┌────────────────────────┐
                │     Rover Hardware     │
                │                        │
                │ Arduino Mega 2560      │
                │ ESP32-CAM              │
                │ NEO-6M GPS Module      │
                │ Motors and Driver      │
                │ Sensors and Servos     │
                │ Irrigation Mechanism   │
                └────────────────────────┘
```

*The diagram represents the system's main components. The actual communication paths depend on the implemented connections and configuration.*

## 📂 Project Structure

The repository contains the mobile application, backend, and supporting project files.

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

*This is an illustrative structure. Update it to match the actual folders and files in the repository.*

## 🚀 Getting Started

### Prerequisites

- Node.js and npm
- Python
- Git
- Expo-compatible development environment
- MongoDB Atlas account for database-backed functionality

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

Follow the Expo instructions to run the application on a compatible device or emulator.

### 3. Set Up the Backend

Navigate to the backend directory:

```bash
cd Backend
```

Create and activate a Python virtual environment if required.

Install the dependencies specified by the backend's actual imports and dependency file. For example:

```bash
pip install flask flask-cors pymongo python-dotenv
```

Additional packages may be required for the machine learning model and other backend functionality.

Configure the MongoDB connection string using the `MONGO_URI` environment variable. Start the Flask application using the entry point and configuration defined in `app.py`.

**Note:** The exact startup command and dependency list should match the current backend implementation.

## 🔐 Security

- Keep database credentials and API keys private.
- Do not commit `.env` files or private signing keys.
- Store production secrets in the hosting platform's environment settings.
- Use placeholder values in `.env.example`.
- Rotate any credentials that may have been exposed.

## 🌍 Sustainable Development Goal

### SDG 2 — Zero Hunger

The project explores how AI, robotics, and IoT can support agricultural activities.

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
- Enhanced irrigation control using soil moisture readings.
- Improved camera-based crop and field analysis.
- GPS-based field mapping and rover position logging.
- Field testing and performance evaluation.
- Improved communication between the rover, application, and backend.

These are proposed enhancements, not claims about existing functionality.

## 👩‍💻 Project Information

- **Project Title:** Smart Agriculture Rover System
- **Domain:** Artificial Intelligence, Machine Learning, IoT, and Robotics
- **Institution:** Atria Institute of Technology, Bengaluru
- **Program:** B.E. Artificial Intelligence and Machine Learning
- **GitHub Repository:** [Smart Agriculture Rover](https://github.com/Ashika-V22/SmartAgricultureRover)

## ⚠️ Disclaimer

This project is an academic prototype developed for educational and demonstration purposes. Crop recommendations depend on the input values supplied to the trained model and the patterns learned from its dataset. GPS functionality depends on obtaining a valid satellite fix. Real-world agricultural decisions should consider verified soil measurements, local conditions, and professional agricultural guidance.

## 📄 License

No license has been specified yet. Unless a license is added to the repository, reuse and redistribution remain subject to applicable copyright rules.
