import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import {
  Alert,
  PermissionsAndroid,
  Platform,
} from "react-native";

import RNBluetoothClassic from "react-native-bluetooth-classic";


const BluetoothContext = createContext();


export function BluetoothProvider({ children }) {

  const [device, setDevice] = useState(null);

  const [connected, setConnected] = useState(false);

  const [connecting, setConnecting] = useState(false);


  // ==========================================
  // LIVE SENSOR VALUES
  // ==========================================

  const [sensorData, setSensorData] = useState({

    temperature: null,

    humidity: null,

    soilMoisture: null,

    battery: null,

    distance: null,

    timestamp: null,

  });


  // ==========================================
  // LIVE GPS VALUES
  // ==========================================

  const [gpsData, setGpsData] = useState({

    latitude: null,

    longitude: null,

    satellites: null,

    altitude: null,

    timestamp: null,

  });


  // ==========================================
  // PERMISSIONS
  // ==========================================

  const requestBluetoothPermissions = async () => {

    if (
      Platform.OS === "android" &&
      Platform.Version >= 31
    ) {

      const result =
        await PermissionsAndroid.requestMultiple([

          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,

          PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,

        ]);


      return (

        result[
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT
        ] === PermissionsAndroid.RESULTS.GRANTED

      );
    }


    return true;
  };


  // ==========================================
  // CONNECT TO HC-05
  // ==========================================

  const connectToRover = async () => {

    try {

      setConnecting(true);


      const permissionGranted =
        await requestBluetoothPermissions();


      if (!permissionGranted) {

        Alert.alert(

          "Bluetooth Permission",

          "Bluetooth permission is required."

        );

        return false;
      }


      const enabled =
        await RNBluetoothClassic.isBluetoothEnabled();


      if (!enabled) {

        Alert.alert(

          "Bluetooth Off",

          "Please turn on Bluetooth."

        );

        return false;
      }


      const pairedDevices =
        await RNBluetoothClassic.getBondedDevices();


      const hc05 =
        pairedDevices.find(

          (item) =>

            item.name &&

            item.name
              .toUpperCase()
              .includes("HC-05")

        );


      if (!hc05) {

        Alert.alert(

          "HC-05 Not Found",

          "Pair HC-05 in Bluetooth settings first."

        );

        return false;
      }


      let isConnected =
        await hc05.isConnected();


      if (!isConnected) {

        isConnected =
          await hc05.connect({

            CONNECTION_TYPE: "delimited",

            DELIMITER: "\n",

            DEVICE_CHARSET: "ascii",

          });
      }


      if (isConnected) {

        setDevice(hc05);

        setConnected(true);

        console.log(
          "HC-05 CONNECTED"
        );

        return true;
      }


      return false;


    } catch (error) {

      console.log(

        "Bluetooth connection error:",

        error

      );


      setDevice(null);

      setConnected(false);

      return false;


    } finally {

      setConnecting(false);
    }
  };


  // ==========================================
  // RECEIVE DATA FROM ARDUINO
  // ==========================================

  useEffect(() => {

    if (!device || !connected) {
      return;
    }


    console.log(

      "Starting HC-05 data listener..."

    );


    const subscription =
      device.onDataReceived((event) => {

        try {

          const raw =
            event.data.trim();


          if (!raw) {
            return;
          }


          console.log(

            "Bluetooth received:",

            raw

          );


          // ======================================
          // GPS MESSAGE
          //
          // Format:
          // GPS,latitude,longitude,satellites,altitude
          //
          // Example:
          // GPS,13.013600,77.546539,5,931.00
          // ======================================

          if (raw.startsWith("GPS,")) {

            const gpsParts =
              raw.split(",");


            if (gpsParts.length !== 5) {

              console.log(
                "Invalid GPS packet:",
                raw
              );

              return;
            }


            const latitude =
              Number(gpsParts[1]);


            const longitude =
              Number(gpsParts[2]);


            const satellites =
              Number(gpsParts[3]);


            const altitude =
              Number(gpsParts[4]);


            if (
              Number.isNaN(latitude) ||
              Number.isNaN(longitude) ||
              Number.isNaN(satellites) ||
              Number.isNaN(altitude)
            ) {

              console.log(
                "Invalid GPS values:",
                raw
              );

              return;
            }


            setGpsData({

              latitude,

              longitude,

              satellites,

              altitude,

              timestamp:
                new Date().toISOString(),

            });


            console.log(

              "GPS data updated:",

              latitude,

              longitude,

              satellites,

              altitude

            );


            // IMPORTANT:
            // Stop here so GPS packet is NOT
            // treated as normal sensor data.

            return;
          }


          // ======================================
          // NORMAL SENSOR MESSAGE
          //
          // Format:
          // temperature,humidity,soil,battery,distance
          //
          // Example:
          // 29.70,58.40,853,8.20,45
          // ======================================

          const parts =
            raw.split(",");


          if (parts.length !== 5) {

            console.log(
              "Invalid sensor packet:",
              raw
            );

            return;
          }


          const temperature =
            Number(parts[0]);


          const humidity =
            Number(parts[1]);


          const soil =
            Number(parts[2]);


          const battery =
            Number(parts[3]);


          const distance =
            Number(parts[4]);


          if (
            Number.isNaN(temperature) ||
            Number.isNaN(humidity) ||
            Number.isNaN(soil) ||
            Number.isNaN(battery) ||
            Number.isNaN(distance)
          ) {

            console.log(
              "Invalid sensor values:",
              raw
            );

            return;
          }


          setSensorData({

            temperature,

            humidity,

            soilMoisture:
              soil,

            battery,

            distance,

            timestamp:
              new Date().toISOString(),

          });


          console.log(

            "Sensor data updated"

          );


        } catch (error) {

          console.log(

            "Bluetooth data parse error:",

            error

          );
        }
      });


    return () => {

      if (subscription) {

        subscription.remove();

      }
    };

  }, [device, connected]);


  // ==========================================
  // SEND COMMAND
  // ==========================================

  const sendBluetoothCommand = async (
    command
  ) => {

    if (!device || !connected) {

      throw new Error(

        "HC-05 is not connected"

      );
    }


    await device.write(

      command,

      "ascii"

    );
  };


  // ==========================================
  // DISCONNECT
  // ==========================================

  const disconnectRover = async () => {

    try {

      if (device) {

        await device.disconnect();

      }

    } catch (error) {

      console.log(

        "Bluetooth disconnect error:",

        error

      );
    }


    setDevice(null);

    setConnected(false);


    // Clear old values on disconnect

    setSensorData({

      temperature: null,

      humidity: null,

      soilMoisture: null,

      battery: null,

      distance: null,

      timestamp: null,

    });


    setGpsData({

      latitude: null,

      longitude: null,

      satellites: null,

      altitude: null,

      timestamp: null,

    });
  };


  // ==========================================
  // PROVIDER
  // ==========================================

  return (

    <BluetoothContext.Provider
      value={{

        device,

        connected,

        connecting,

        sensorData,

        gpsData,

        connectToRover,

        disconnectRover,

        sendBluetoothCommand,

      }}
    >

      {children}

    </BluetoothContext.Provider>
  );
}


export function useBluetooth() {

  return useContext(
    BluetoothContext
  );
}