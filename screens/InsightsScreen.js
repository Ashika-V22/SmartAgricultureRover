import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Card } from "react-native-paper";
import { LineChart } from "react-native-chart-kit";

const API_URL = "https://smartagriculturerover.onrender.com";

export default function InsightsScreen() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const fetchHistory = async () => {
    try {
      setError("");

      const response = await fetch(`${API_URL}/sensor-history`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to load sensor history");
      }

      const records = Array.isArray(data.history)
        ? data.history
        : [];

      setHistory(records.reverse());
    } catch (err) {
      console.log("Sensor history error:", err);
      setError("Unable to load sensor history.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  React.useEffect(() => {
    fetchHistory();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchHistory();
  }, []);

  const latest = history.length > 0 ? history[history.length - 1] : null;

  const getChartData = (key) => {
    const values = history.slice(-10);

    return {
      labels: values.map((item, index) =>
        index % 2 === 0
          ? new Date(item.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : ""
      ),
      datasets: [
        {
          data:
            values.length > 0
              ? values.map((item) => Number(item[key]) || 0)
              : [0],
        },
      ],
    };
  };

  const chartConfig = {
    backgroundGradientFrom: "#FFFFFF",
    backgroundGradientTo: "#FFFFFF",
    decimalPlaces: 1,
    color: (opacity = 1) =>
      `rgba(46, 125, 50, ${opacity})`,
    labelColor: (opacity = 1) =>
      `rgba(75, 85, 99, ${opacity})`,
    propsForDots: {
      r: "4",
    },
    propsForBackgroundLines: {
      strokeDasharray: "",
      strokeWidth: 1,
      stroke: "#E5E7EB",
    },
  };

  const renderChart = (title, icon, key, unit) => {
    if (history.length === 0) {
      return null;
    }

    return (
      <Card style={styles.chartCard}>
        <View style={styles.chartHeader}>
          <View>
            <Text style={styles.chartTitle}>
              {icon} {title}
            </Text>

            <Text style={styles.chartSubtitle}>
              Last {Math.min(history.length, 10)} readings
            </Text>
          </View>

          <Text style={styles.unit}>{unit}</Text>
        </View>

        <LineChart
          data={getChartData(key)}
          width={330}
          height={210}
          chartConfig={chartConfig}
          bezier
          fromZero={false}
          withInnerLines
          withOuterLines={false}
          style={styles.chart}
        />
      </Card>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCircle}>
          <Text style={styles.loadingIcon}>📊</Text>
        </View>

        <ActivityIndicator
          size="large"
          color="#4CAF50"
        />

        <Text style={styles.loadingText}>
          Loading sensor insights...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={["#4CAF50"]}
        />
      }
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>
          📊 Insights
        </Text>

        <Text style={styles.subtitle}>
          Understand your rover's sensor history
        </Text>
      </View>

      {/* Error */}
      {error ? (
        <Card style={styles.errorCard}>
          <Text style={styles.errorIcon}>⚠️</Text>

          <Text style={styles.errorTitle}>
            Something went wrong
          </Text>

          <Text style={styles.errorText}>
            {error}
          </Text>

          <TouchableOpacity
            style={styles.retryButton}
            onPress={fetchHistory}
          >
            <Text style={styles.retryText}>
              Try Again
            </Text>
          </TouchableOpacity>
        </Card>
      ) : null}

      {/* Latest Reading */}
      {latest ? (
        <>
          <Text style={styles.sectionTitle}>
            Latest Reading
          </Text>

          <Card style={styles.latestCard}>
            <View style={styles.latestHeader}>
              <View>
                <Text style={styles.latestTitle}>
                  Current Environment
                </Text>

                <Text style={styles.latestTime}>
                  {new Date(
                    latest.timestamp
                  ).toLocaleString()}
                </Text>
              </View>

              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveText}>
                  LIVE
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricIcon}>
                  🌡️
                </Text>

                <Text style={styles.metricValue}>
                  {latest.temperature}°C
                </Text>

                <Text style={styles.metricLabel}>
                  Temperature
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricIcon}>
                  💧
                </Text>

                <Text style={styles.metricValue}>
                  {latest.humidity}%
                </Text>

                <Text style={styles.metricLabel}>
                  Humidity
                </Text>
              </View>
            </View>

            <View style={styles.metricsRow}>
              <View style={styles.metric}>
                <Text style={styles.metricIcon}>
                  🌱
                </Text>

                <Text style={styles.metricValue}>
                  {latest.soilMoisture}%
                </Text>

                <Text style={styles.metricLabel}>
                  Soil Moisture
                </Text>
              </View>

              <View style={styles.metric}>
                <Text style={styles.metricIcon}>
                  🔋
                </Text>

                <Text style={styles.metricValue}>
                  {latest.battery}%
                </Text>

                <Text style={styles.metricLabel}>
                  Battery
                </Text>
              </View>
            </View>
          </Card>
        </>
      ) : (
        <Card style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>📭</Text>

          <Text style={styles.emptyTitle}>
            No sensor history yet
          </Text>

          <Text style={styles.emptyText}>
            Sensor readings will appear here once
            the rover starts sending data.
          </Text>
        </Card>
      )}

      {/* Charts */}
      {history.length > 0 && (
        <>
          <Text style={styles.sectionTitle}>
            Sensor Trends
          </Text>

          {renderChart(
            "Temperature",
            "🌡️",
            "temperature",
            "°C"
          )}

          {renderChart(
            "Humidity",
            "💧",
            "humidity",
            "%"
          )}

          {renderChart(
            "Soil Moisture",
            "🌱",
            "soilMoisture",
            "%"
          )}

          {renderChart(
            "Battery",
            "🔋",
            "battery",
            "%"
          )}
        </>
      )}

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Pull down to refresh sensor data
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F8F3",
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  header: {
    marginTop: 15,
    marginBottom: 22,
  },

  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#183A24",
  },

  subtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 6,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#183A24",
    marginBottom: 12,
    marginTop: 8,
  },

  latestCard: {
    borderRadius: 22,
    padding: 20,
    backgroundColor: "#FFFFFF",
    elevation: 4,
    marginBottom: 25,
  },

  latestHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 18,
  },

  latestTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#183A24",
  },

  latestTime: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 4,
  },

  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E8F5E9",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#4CAF50",
    marginRight: 5,
  },

  liveText: {
    fontSize: 10,
    fontWeight: "800",
    color: "#2E7D32",
  },

  metricsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },

  metric: {
    width: "48%",
    backgroundColor: "#F8FAF8",
    borderRadius: 16,
    padding: 15,
    marginBottom: 10,
  },

  metricIcon: {
    fontSize: 25,
  },

  metricValue: {
    fontSize: 22,
    fontWeight: "800",
    color: "#2E7D32",
    marginTop: 5,
  },

  metricLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginTop: 3,
  },

  chartCard: {
    borderRadius: 22,
    backgroundColor: "#FFFFFF",
    padding: 15,
    marginBottom: 18,
    elevation: 3,
  },

  chartHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },

  chartTitle: {
    fontSize: 17,
    fontWeight: "800",
    color: "#183A24",
  },

  chartSubtitle: {
    fontSize: 11,
    color: "#9CA3AF",
    marginTop: 3,
  },

  unit: {
    fontSize: 15,
    fontWeight: "800",
    color: "#4CAF50",
  },

  chart: {
    marginLeft: -10,
    borderRadius: 16,
  },

  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 22,
    padding: 30,
    alignItems: "center",
    elevation: 3,
    marginBottom: 25,
  },

  emptyIcon: {
    fontSize: 42,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: "800",
    color: "#183A24",
    marginTop: 12,
  },

  emptyText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 13,
    marginTop: 8,
    lineHeight: 20,
  },

  errorCard: {
    backgroundColor: "#FFF7ED",
    borderRadius: 20,
    padding: 22,
    alignItems: "center",
    marginBottom: 20,
  },

  errorIcon: {
    fontSize: 32,
  },

  errorTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#92400E",
    marginTop: 8,
  },

  errorText: {
    color: "#B45309",
    marginTop: 5,
    textAlign: "center",
  },

  retryButton: {
    marginTop: 15,
    backgroundColor: "#4CAF50",
    paddingHorizontal: 22,
    paddingVertical: 10,
    borderRadius: 12,
  },

  retryText: {
    color: "#FFFFFF",
    fontWeight: "800",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3F8F3",
    justifyContent: "center",
    alignItems: "center",
  },

  loadingCircle: {
    width: 75,
    height: 75,
    borderRadius: 38,
    backgroundColor: "#DDF3E0",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 18,
  },

  loadingIcon: {
    fontSize: 35,
  },

  loadingText: {
    marginTop: 12,
    color: "#6B7280",
    fontSize: 14,
  },

  footer: {
    alignItems: "center",
    marginTop: 10,
  },

  footerText: {
    color: "#9CA3AF",
    fontSize: 11,
  },
});