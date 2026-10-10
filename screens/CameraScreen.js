import React, {
  useCallback,
  useState,
} from "react";

import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from "react-native";

import { WebView } from "react-native-webview";
import { Card } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  useFocusEffect,
} from "@react-navigation/native";

import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";


// ==========================================
// DEFAULT ESP32-CAM IP
// ==========================================

const DEFAULT_CAMERA_IP =
  "192.168.1.38";


export default function CameraScreen() {

  const {
    theme,
    colors,
  } = useTheme();

  const {
    t,
  } = useLanguage();


  const [loading, setLoading] =
    useState(true);

  const [
    cameraError,
    setCameraError,
  ] = useState(false);

  const [
    fullScreen,
    setFullScreen,
  ] = useState(false);


  // ==========================================
  // CAMERA URL
  // ==========================================

  const [
    cameraURL,
    setCameraURL,
  ] = useState(
    `http://${DEFAULT_CAMERA_IP}`
  );


  const [
    cameraKey,
    setCameraKey,
  ] = useState(0);


  const isDark =
    theme === "dark";


  // ==========================================
  // LOAD SAVED CAMERA IP EVERY TIME
  // CAMERA TAB IS OPENED
  // ==========================================

  useFocusEffect(

    useCallback(() => {

      const loadCameraAddress =
        async () => {

          try {

            const savedIP =
              await AsyncStorage.getItem(
                "camera_ip"
              );


            const ip =
              savedIP ||
              DEFAULT_CAMERA_IP;


            const cleanedIP =
              ip
                .trim()
                .replace(
                  /^https?:\/\//i,
                  ""
                )
                .replace(
                  /\/+$/,
                  ""
                );


            const newURL =
              `http://${cleanedIP}`;


            console.log(
              "Using ESP32-CAM URL:",
              newURL
            );


            setCameraURL(
              newURL
            );


            // Force WebView reload
            setCameraKey(
              previous =>
                previous + 1
            );


            setCameraError(
              false
            );


            setLoading(
              true
            );

          } catch (error) {

            console.log(
              "Camera address load error:",
              error
            );
          }
        };


      loadCameraAddress();

    }, [])
  );


  // ==========================================
  // THEME COLORS
  // ==========================================

  const textColor =
    colors.text ||
    (
      isDark
        ? "#FFFFFF"
        : "#333333"
    );


  const secondaryText =
    colors.secondaryText ||
    (
      isDark
        ? "#BBBBBB"
        : "#777777"
    );


  const backgroundColor =
    colors.background ||
    (
      isDark
        ? "#121212"
        : "#F2F8F1"
    );


  const cardColor =
    colors.card ||
    (
      isDark
        ? "#1E1E1E"
        : "#FFFFFF"
    );


  const borderColor =
    colors.border ||
    (
      isDark
        ? "#333333"
        : "#EEEEEE"
    );


  const primaryColor =
    colors.primary ||
    colors.green ||
    "#2E7D32";


  return (

    <>

      {/* ==========================================
          NORMAL CAMERA PAGE
      ========================================== */}

      <ScrollView

        style={[
          styles.container,
          {
            backgroundColor:
              backgroundColor,
          },
        ]}

        contentContainerStyle={
          styles.content
        }

        showsVerticalScrollIndicator={
          false
        }

      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <View
          style={
            styles.header
          }
        >

          <View
            style={
              styles.headerText
            }
          >

            <Text
              style={[
                styles.title,
                {
                  color:
                    primaryColor,
                },
              ]}
            >
              {t("roverCamera")}
            </Text>


            <Text
              style={[
                styles.subtitle,
                {
                  color:
                    secondaryText,
                },
              ]}
            >
              {t(
                "liveESP32CameraMonitoring"
              )}
            </Text>

          </View>


          <View
            style={[
              styles.headerIcon,
              {
                backgroundColor:
                  isDark
                    ? "#263A29"
                    : "#E8F5E9",
              },
            ]}
          >

            <Ionicons
              name="camera-outline"
              size={28}
              color={
                primaryColor
              }
            />

          </View>

        </View>


        {/* ==========================================
            CAMERA STATUS
        ========================================== */}

        <Card
          style={[
            styles.statusCard,
            {
              backgroundColor:
                cardColor,
            },
          ]}
        >

          <View
            style={[
              styles.statusIcon,
              {
                backgroundColor:
                  cameraError
                    ? (
                      isDark
                        ? "#3A2B1B"
                        : "#FFF3E0"
                    )
                    : (
                      isDark
                        ? "#263A29"
                        : "#E8F5E9"
                    ),
              },
            ]}
          >

            <Ionicons

              name={
                cameraError
                  ? "warning-outline"
                  : "videocam-outline"
              }

              size={28}

              color={
                cameraError
                  ? "#EF6C00"
                  : primaryColor
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
                    secondaryText,
                },
              ]}
            >
              {t("cameraStatus")}
            </Text>


            <Text
              style={[
                styles.statusText,
                {
                  color:
                    cameraError
                      ? "#EF6C00"
                      : primaryColor,
                },
              ]}
            >

              {
                cameraError
                  ? "Camera Unavailable"
                  : loading
                  ? "Connecting..."
                  : "Camera Ready"
              }

            </Text>

          </View>


          <View
            style={[
              styles.statusDot,
              {
                backgroundColor:
                  cameraError
                    ? "#EF6C00"
                    : loading
                    ? "#F9A825"
                    : primaryColor,
              },
            ]}
          />

        </Card>


        {/* ==========================================
            LIVE VIDEO HEADER
        ========================================== */}

        <View
          style={
            styles.sectionHeader
          }
        >

          <Text
            style={[
              styles.sectionTitle,
              {
                color:
                  textColor,
              },
            ]}
          >
            {t("liveVideo")}
          </Text>


          {
            !cameraError &&
            !loading &&
            (

              <View
                style={
                  styles.liveBadge
                }
              >

                <View
                  style={
                    styles.liveDot
                  }
                />

                <Text
                  style={
                    styles.liveText
                  }
                >
                  READY
                </Text>

              </View>

            )
          }

        </View>


        {/* ==========================================
            CAMERA PREVIEW
        ========================================== */}

        <Card
          style={[
            styles.cameraCard,
            {
              backgroundColor:
                "#000000",
            },
          ]}
        >

          <View
            style={
              styles.videoContainer
            }
          >

            {
              !cameraError &&
              (

                <WebView

                  key={
                    `preview-${cameraKey}`
                  }

                  source={{
                    uri:
                      cameraURL,
                  }}

                  style={
                    styles.webview
                  }

                  originWhitelist={[
                    "*",
                  ]}

                  javaScriptEnabled={
                    true
                  }

                  domStorageEnabled={
                    true
                  }

                  mixedContentMode="always"

                  allowsInlineMediaPlayback={
                    true
                  }

                  mediaPlaybackRequiresUserAction={
                    false
                  }

                  scrollEnabled={
                    false
                  }


                  onLoadStart={() => {

                    setLoading(true);

                    setCameraError(
                      false
                    );
                  }}


                  onLoadEnd={() => {

                    setLoading(
                      false
                    );
                  }}


                  onError={(event) => {

                    console.log(
                      "Camera error:",
                      event.nativeEvent
                    );


                    setLoading(
                      false
                    );


                    setCameraError(
                      true
                    );
                  }}

                />

              )
            }


            {/* ==========================================
                LOADING
            ========================================== */}

            {
              loading &&
              !cameraError &&
              (

                <View
                  style={
                    styles.loadingOverlay
                  }
                >

                  <ActivityIndicator
                    size="large"
                    color={
                      primaryColor
                    }
                  />


                  <Text
                    style={
                      styles.loadingText
                    }
                  >
                    Connecting to ESP32-CAM...
                  </Text>


                  <Text
                    style={
                      styles.loadingSubText
                    }
                  >
                    {cameraURL}
                  </Text>

                </View>

              )
            }


            {/* ==========================================
                ERROR
            ========================================== */}

            {
              cameraError &&
              (

                <View
                  style={
                    styles.errorContainer
                  }
                >

                  <Ionicons
                    name="videocam-off-outline"
                    size={55}
                    color="#EF6C00"
                  />


                  <Text
                    style={
                      styles.errorTitle
                    }
                  >
                    Camera Unavailable
                  </Text>


                  <Text
                    style={
                      styles.errorText
                    }
                  >
                    Make sure the ESP32-CAM
                    is powered and connected
                    to the same Wi-Fi or hotspot.
                  </Text>


                  <Text
                    style={
                      styles.errorURL
                    }
                  >
                    {cameraURL}
                  </Text>


                  <TouchableOpacity

                    style={[
                      styles.retryButton,
                      {
                        backgroundColor:
                          primaryColor,
                      },
                    ]}

                    onPress={() => {

                      setCameraError(
                        false
                      );

                      setLoading(
                        true
                      );

                      setCameraKey(
                        previous =>
                          previous + 1
                      );
                    }}

                  >

                    <Ionicons
                      name="refresh"
                      size={18}
                      color="#FFFFFF"
                    />


                    <Text
                      style={
                        styles.retryText
                      }
                    >
                      Retry
                    </Text>

                  </TouchableOpacity>

                </View>

              )
            }


            {/* ==========================================
                OPEN FULL SCREEN
            ========================================== */}

            {
              !cameraError &&
              !loading &&
              (

                <TouchableOpacity

                  style={
                    styles.openOverlay
                  }

                  onPress={() =>
                    setFullScreen(
                      true
                    )
                  }

                  activeOpacity={
                    0.8
                  }

                >

                  <View
                    style={
                      styles.openButton
                    }
                  >

                    <Ionicons
                      name="expand-outline"
                      size={23}
                      color="#FFFFFF"
                    />


                    <Text
                      style={
                        styles.openButtonText
                      }
                    >
                      Tap to Open Camera
                    </Text>

                  </View>

                </TouchableOpacity>

              )
            }

          </View>

        </Card>


        {/* ==========================================
            CAMERA INFORMATION
        ========================================== */}

        <Text
          style={[
            styles.sectionTitle,
            {
              color:
                textColor,
            },
          ]}
        >
          {t("cameraInformation")}
        </Text>


        <Card
          style={[
            styles.infoCard,
            {
              backgroundColor:
                cardColor,
            },
          ]}
        >

          <InfoRow
            icon="hardware-chip-outline"
            label={t("camera")}
            value="ESP32-CAM"
            textColor={textColor}
            secondaryText={secondaryText}
            primaryColor={primaryColor}
          />


          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  borderColor,
              },
            ]}
          />


          <InfoRow
            icon="wifi-outline"
            label={t("connection")}
            value="Wi-Fi"
            textColor={textColor}
            secondaryText={secondaryText}
            primaryColor={primaryColor}
          />


          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  borderColor,
              },
            ]}
          />


          <InfoRow
            icon="link-outline"
            label="Camera Address"
            value={
              cameraURL
            }
            textColor={textColor}
            secondaryText={secondaryText}
            primaryColor={primaryColor}
          />


          <View
            style={[
              styles.divider,
              {
                backgroundColor:
                  borderColor,
              },
            ]}
          />


          <InfoRow
            icon="eye-outline"
            label={t("purpose")}
            value={t(
              "roverMonitoring"
            )}
            textColor={textColor}
            secondaryText={secondaryText}
            primaryColor={primaryColor}
          />

        </Card>


        <Text
          style={[
            styles.note,
            {
              color:
                secondaryText,
            },
          ]}
        >
          Change the camera IP from
          Settings if the ESP32-CAM
          connects to a different network.
        </Text>

      </ScrollView>


      {/* ==========================================
          FULL SCREEN CAMERA MODAL
      ========================================== */}

      <Modal

        visible={
          fullScreen
        }

        animationType="slide"

        presentationStyle="fullScreen"

        onRequestClose={() =>
          setFullScreen(
            false
          )
        }

      >

        <SafeAreaView
          style={
            styles.fullScreenContainer
          }
        >

          {/* HEADER */}

          <View
            style={
              styles.fullScreenHeader
            }
          >

            <View>

              <Text
                style={
                  styles.fullScreenTitle
                }
              >
                ESP32-CAM
              </Text>


              <Text
                style={
                  styles.fullScreenSubtitle
                }
              >
                Live Rover Camera
              </Text>

            </View>


            <TouchableOpacity

              style={
                styles.closeButton
              }

              onPress={() =>
                setFullScreen(
                  false
                )
              }

            >

              <Ionicons
                name="close"
                size={28}
                color="#FFFFFF"
              />

            </TouchableOpacity>

          </View>


          {/* ==========================================
              FULL SCREEN WEBVIEW
          ========================================== */}

          <WebView

            key={
              `fullscreen-${cameraKey}`
            }

            source={{
              uri:
                cameraURL,
            }}

            style={
              styles.fullScreenWebView
            }

            originWhitelist={[
              "*",
            ]}

            javaScriptEnabled={
              true
            }

            domStorageEnabled={
              true
            }

            mixedContentMode="always"

            allowsInlineMediaPlayback={
              true
            }

            mediaPlaybackRequiresUserAction={
              false
            }


            // Scroll in all directions

            scrollEnabled={
              true
            }

            bounces={
              true
            }


            // Zoom

            setBuiltInZoomControls={
              true
            }

            setDisplayZoomControls={
              false
            }


            // Keep ESP page wide
            // so you can move left/right

            injectedJavaScript={`
              (function() {

                var meta =
                  document.querySelector(
                    'meta[name="viewport"]'
                  );

                if (meta) {

                  meta.setAttribute(
                    'content',
                    'width=1000, initial-scale=0.8, minimum-scale=0.3, maximum-scale=3.0, user-scalable=yes'
                  );

                } else {

                  var newMeta =
                    document.createElement(
                      'meta'
                    );

                  newMeta.name =
                    'viewport';

                  newMeta.content =
                    'width=1000, initial-scale=0.8, minimum-scale=0.3, maximum-scale=3.0, user-scalable=yes';

                  document.head.appendChild(
                    newMeta
                  );

                }


                document.documentElement.style.overflow =
                  'auto';

                document.body.style.overflow =
                  'auto';


                document.documentElement.style.minWidth =
                  '1000px';

                document.body.style.minWidth =
                  '1000px';


                document.documentElement.style.touchAction =
                  'pan-x pan-y pinch-zoom';

                document.body.style.touchAction =
                  'pan-x pan-y pinch-zoom';


                true;

              })();
            `}


            onError={(event) => {

              console.log(
                "Fullscreen camera error:",
                event.nativeEvent
              );

            }}

          />

        </SafeAreaView>

      </Modal>

    </>
  );
}


// ==========================================
// INFORMATION ROW
// ==========================================

function InfoRow({

  icon,

  label,

  value,

  textColor,

  secondaryText,

  primaryColor,

}) {

  return (

    <View
      style={
        styles.infoRow
      }
    >

      <Ionicons
        name={icon}
        size={22}
        color={
          primaryColor
        }
      />


      <Text
        style={[
          styles.infoLabel,
          {
            color:
              textColor,
          },
        ]}
      >
        {label}
      </Text>


      <Text
        numberOfLines={1}
        style={[
          styles.infoValue,
          {
            color:
              secondaryText,
          },
        ]}
      >
        {value}
      </Text>

    </View>
  );
}


// ==========================================
// STYLES
// ==========================================

const styles =
  StyleSheet.create({

    container: {
      flex: 1,
    },

    content: {
      padding: 20,
      paddingBottom: 40,
    },


    // HEADER

    header: {
      marginTop: 20,
      marginBottom: 22,

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },

    headerText: {
      flex: 1,
      paddingRight: 10,
    },

    title: {
      fontSize: 28,
      fontWeight: "bold",
    },

    subtitle: {
      fontSize: 14,
      marginTop: 5,
    },

    headerIcon: {
      width: 55,
      height: 55,

      borderRadius: 28,

      justifyContent:
        "center",

      alignItems:
        "center",
    },


    // STATUS

    statusCard: {
      padding: 18,

      borderRadius: 18,

      elevation: 3,

      flexDirection:
        "row",

      alignItems:
        "center",

      marginBottom: 25,
    },

    statusIcon: {
      width: 55,
      height: 55,

      borderRadius: 28,

      justifyContent:
        "center",

      alignItems:
        "center",

      marginRight: 13,
    },

    statusInfo: {
      flex: 1,
    },

    statusTitle: {
      fontSize: 13,
    },

    statusText: {
      fontSize: 17,
      fontWeight: "bold",
      marginTop: 4,
    },

    statusDot: {
      width: 11,
      height: 11,

      borderRadius: 6,
    },


    // SECTION

    sectionHeader: {
      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",

      marginBottom: 12,
    },

    sectionTitle: {
      fontSize: 18,
      fontWeight: "bold",
      marginBottom: 12,
    },


    // LIVE BADGE

    liveBadge: {
      flexDirection: "row",

      alignItems: "center",

      backgroundColor:
        "#E8F5E9",

      paddingHorizontal: 10,

      paddingVertical: 5,

      borderRadius: 15,

      marginBottom: 12,
    },

    liveDot: {
      width: 7,
      height: 7,

      borderRadius: 4,

      backgroundColor:
        "#2E7D32",

      marginRight: 5,
    },

    liveText: {
      fontSize: 10,

      fontWeight: "bold",

      color:
        "#2E7D32",
    },


    // CAMERA

    cameraCard: {
      borderRadius: 18,

      elevation: 5,

      overflow: "hidden",

      marginBottom: 25,
    },

    videoContainer: {
      width: "100%",

      height: 300,

      backgroundColor:
        "#000000",

      position: "relative",
    },

    webview: {
      flex: 1,

      backgroundColor:
        "#000000",
    },


    // OPEN CAMERA

    openOverlay: {
      position: "absolute",

      left: 0,
      right: 0,
      bottom: 0,

      padding: 15,

      alignItems:
        "center",
    },

    openButton: {
      flexDirection: "row",

      alignItems:
        "center",

      backgroundColor:
        "rgba(0,0,0,0.75)",

      paddingHorizontal: 18,

      paddingVertical: 11,

      borderRadius: 22,
    },

    openButtonText: {
      color: "#FFFFFF",

      fontWeight: "bold",

      fontSize: 13,

      marginLeft: 8,
    },


    // LOADING

    loadingOverlay: {
      position: "absolute",

      top: 0,
      left: 0,
      right: 0,
      bottom: 0,

      justifyContent:
        "center",

      alignItems:
        "center",

      backgroundColor:
        "#111111",

      paddingHorizontal: 15,
    },

    loadingText: {
      color: "#FFFFFF",

      marginTop: 12,

      fontSize: 14,
    },

    loadingSubText: {
      color: "#AAAAAA",

      marginTop: 6,

      fontSize: 11,

      textAlign: "center",
    },


    // ERROR

    errorContainer: {
      flex: 1,

      justifyContent:
        "center",

      alignItems:
        "center",

      padding: 25,

      backgroundColor:
        "#111111",
    },

    errorTitle: {
      color: "#FFFFFF",

      fontSize: 18,

      fontWeight: "bold",

      marginTop: 12,
    },

    errorText: {
      color: "#BBBBBB",

      fontSize: 13,

      textAlign: "center",

      marginTop: 8,

      lineHeight: 19,
    },

    errorURL: {
      color: "#888888",

      fontSize: 11,

      marginTop: 10,

      textAlign: "center",
    },

    retryButton: {
      marginTop: 18,

      flexDirection: "row",

      alignItems: "center",

      paddingHorizontal: 20,

      paddingVertical: 11,

      borderRadius: 22,
    },

    retryText: {
      color: "#FFFFFF",

      fontWeight: "bold",

      marginLeft: 7,
    },


    // INFO

    infoCard: {
      padding: 18,

      borderRadius: 18,

      elevation: 3,

      marginBottom: 15,
    },

    infoRow: {
      minHeight: 50,

      flexDirection: "row",

      alignItems: "center",
    },

    infoLabel: {
      flex: 1,

      marginLeft: 12,

      fontSize: 14,

      fontWeight: "600",
    },

    infoValue: {
      maxWidth: "48%",

      fontSize: 13,

      textAlign: "right",
    },

    divider: {
      height: 1,
    },

    note: {
      textAlign: "center",

      fontSize: 11,

      marginTop: 5,

      lineHeight: 17,
    },


    // FULL SCREEN

    fullScreenContainer: {
      flex: 1,

      backgroundColor:
        "#000000",
    },

    fullScreenHeader: {
      height: 70,

      paddingHorizontal: 18,

      backgroundColor:
        "#111111",

      flexDirection: "row",

      justifyContent:
        "space-between",

      alignItems:
        "center",
    },

    fullScreenTitle: {
      color: "#FFFFFF",

      fontSize: 19,

      fontWeight: "bold",
    },

    fullScreenSubtitle: {
      color: "#AAAAAA",

      fontSize: 11,

      marginTop: 2,
    },

    closeButton: {
      width: 43,
      height: 43,

      borderRadius: 22,

      backgroundColor:
        "#333333",

      justifyContent:
        "center",

      alignItems:
        "center",
    },

    fullScreenWebView: {
      flex: 1,

      backgroundColor:
        "#000000",
    },

  });