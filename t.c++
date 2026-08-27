#include <Arduino.h>
#include <Servo.h>
#include <DHT.h>

// =====================================================
// DHT11
// =====================================================

#define DHTPIN 25
#define DHTTYPE DHT11

DHT dht(DHTPIN, DHTTYPE);

// =====================================================
// MOTOR DRIVER PINS
// =====================================================

// L298N #1 - Left motors
const int LM1 = 3;
const int LM2 = 4;
const int LM3 = 5;
const int LM4 = 6;

// L298N #2 - Right motors
const int RM1 = 7;
const int RM2 = 8;
const int RM3 = 9;
const int RM4 = 10;

// =====================================================
// SERVOS
// =====================================================

Servo ploughServo;
Servo seedServo;

const int ploughServoPin = 11;
const int seedServoPin = 12;

// =====================================================
// RELAY
// =====================================================

// Pump only
const int pumpRelay = 13;

// =====================================================
// SENSORS
// =====================================================

const int soilSensor = A0;
const int voltageSensor = A1;

// Ultrasonic sensor
const int trigPin = 30;
const int echoPin = 31;

// Buzzer
const int buzzerPin = 32;

// =====================================================
// TIMERS
// =====================================================

unsigned long previousMillis = 0;
unsigned long lastSendTime = 0;
unsigned long obstacleMillis = 0;

const unsigned long seedInterval = 400;
const unsigned long sensorInterval = 5000;
const unsigned long backwardDuration = 500;

// =====================================================
// SEED MECHANISM
// =====================================================

bool seedMode = false;
bool seedPosition = false;

// =====================================================
// OBSTACLE AVOIDANCE
// =====================================================

bool avoidingObstacle = false;

// =====================================================
// BLUETOOTH
// =====================================================

char data = 'S';

// =====================================================
// SETUP
// =====================================================

void setup()
{
  // -------------------------
  // Motor pins
  // -------------------------

  pinMode(LM1, OUTPUT);
  pinMode(LM2, OUTPUT);
  pinMode(LM3, OUTPUT);
  pinMode(LM4, OUTPUT);

  pinMode(RM1, OUTPUT);
  pinMode(RM2, OUTPUT);
  pinMode(RM3, OUTPUT);
  pinMode(RM4, OUTPUT);

  // -------------------------
  // Pump relay
  // -------------------------

  pinMode(pumpRelay, OUTPUT);
  digitalWrite(pumpRelay, LOW);

  // -------------------------
  // Ultrasonic
  // -------------------------

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  // -------------------------
  // Buzzer
  // -------------------------

  pinMode(buzzerPin, OUTPUT);
  digitalWrite(buzzerPin, LOW);

  // -------------------------
  // Serial communication
  // -------------------------

  Serial.begin(9600);

  // HC-05
  Serial1.begin(9600);

  // NEO-6M GPS
  Serial2.begin(9600);

  // -------------------------
  // Servos
  // -------------------------

  ploughServo.attach(ploughServoPin);
  ploughServo.write(90);

  seedServo.attach(seedServoPin);
  seedServo.write(90);

  // -------------------------
  // DHT11
  // -------------------------

  dht.begin();

  // -------------------------
  // Stop motors at startup
  // -------------------------

  stopBot();

  // -------------------------
  // Startup message
  // -------------------------

  Serial.println("================================");
  Serial.println("MULTIPURPOSE AGRI BOT");
  Serial.println("Arduino Mega Started");
  Serial.println("GPS: Serial2 - D16/D17");
  Serial.println("HC-05: Serial1 - D18/D19");
  Serial.println("ESP32-CAM: Separate Wi-Fi Camera");
  Serial.println("Grass Cutter: REMOVED");
  Serial.println("Solar Panel: NOT USED");
  Serial.println("================================");
}

// =====================================================
// FORWARD
// =====================================================

void forward()
{
  digitalWrite(LM1, HIGH);
  digitalWrite(LM2, LOW);

  digitalWrite(LM3, HIGH);
  digitalWrite(LM4, LOW);

  digitalWrite(RM1, LOW);
  digitalWrite(RM2, HIGH);

  digitalWrite(RM3, LOW);
  digitalWrite(RM4, HIGH);
}

// =====================================================
// BACKWARD
// =====================================================

void backward()
{
  digitalWrite(LM1, LOW);
  digitalWrite(LM2, HIGH);

  digitalWrite(LM3, LOW);
  digitalWrite(LM4, HIGH);

  digitalWrite(RM1, HIGH);
  digitalWrite(RM2, LOW);

  digitalWrite(RM3, HIGH);
  digitalWrite(RM4, LOW);
}

// =====================================================
// LEFT
// =====================================================

void left()
{
  // Stop left motors

  digitalWrite(LM1, LOW);
  digitalWrite(LM2, LOW);
  digitalWrite(LM3, LOW);
  digitalWrite(LM4, LOW);

  // Move right motors

  digitalWrite(RM1, LOW);
  digitalWrite(RM2, HIGH);
  digitalWrite(RM3, LOW);
  digitalWrite(RM4, HIGH);
}

// =====================================================
// RIGHT
// =====================================================

void right()
{
  // Stop right motors

  digitalWrite(RM1, LOW);
  digitalWrite(RM2, LOW);
  digitalWrite(RM3, LOW);
  digitalWrite(RM4, LOW);

  // Move left motors

  digitalWrite(LM1, HIGH);
  digitalWrite(LM2, LOW);
  digitalWrite(LM3, HIGH);
  digitalWrite(LM4, LOW);
}

// =====================================================
// STOP
// =====================================================

void stopBot()
{
  digitalWrite(LM1, LOW);
  digitalWrite(LM2, LOW);
  digitalWrite(LM3, LOW);
  digitalWrite(LM4, LOW);

  digitalWrite(RM1, LOW);
  digitalWrite(RM2, LOW);
  digitalWrite(RM3, LOW);
  digitalWrite(RM4, LOW);
}

// =====================================================
// PUMP
// =====================================================

void pumpOn()
{
  digitalWrite(pumpRelay, HIGH);
}

void pumpOff()
{
  digitalWrite(pumpRelay, LOW);
}

// =====================================================
// ULTRASONIC DISTANCE
// =====================================================

long getDistance()
{
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);

  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0)
  {
    return 0;
  }

  long distance = duration * 0.034 / 2;

  return distance;
}

// =====================================================
// BATTERY VOLTAGE
// =====================================================

float readBatteryVoltage()
{
  int sensorValue = analogRead(voltageSensor);

  float voltage = sensorValue * (5.0 / 1023.0) * 2;

  return voltage;
}

// =====================================================
// GPS
// =====================================================

void readGPS()
{
  while (Serial2.available())
  {
    char gpsData = Serial2.read();

    // Display raw GPS data
    // on the computer Serial Monitor

    Serial.write(gpsData);
  }
}

// =====================================================
// BLUETOOTH COMMANDS
// =====================================================

void handleBluetooth()
{
  if (Serial1.available())
  {
    data = Serial1.read();

    Serial.print("Bluetooth Command: ");
    Serial.println(data);

    // -------------------------
    // Movement
    // -------------------------

    if (data == 'F')
    {
      forward();
    }

    else if (data == 'B')
    {
      backward();
    }

    else if (data == 'L')
    {
      left();
    }

    else if (data == 'R')
    {
      right();
    }

    else if (data == 'S')
    {
      stopBot();
    }

    // -------------------------
    // Plough
    // -------------------------

    else if (data == 'U')
    {
      ploughServo.write(60);
    }

    else if (data == 'D')
    {
      ploughServo.write(120);
    }

    // -------------------------
    // Seed mechanism
    // -------------------------

    else if (data == 'O')
    {
      seedMode = true;
    }

    else if (data == 'X')
    {
      seedMode = false;
      seedServo.write(90);
    }

    // -------------------------
    // Water pump
    // -------------------------

    else if (data == 'W')
    {
      pumpOn();
    }

    else if (data == 'Q')
    {
      pumpOff();
    }
  }
}

// =====================================================
// OBSTACLE DETECTION
// =====================================================

void obstacleDetection()
{
  long distance = getDistance();

  // Very close obstacle

  if (distance > 0 && distance < 30)
  {
    stopBot();

    digitalWrite(buzzerPin, HIGH);

    avoidingObstacle = false;
  }

  // Medium-distance obstacle

  else if (distance >= 30 && distance < 50)
  {
    if (!avoidingObstacle)
    {
      backward();

      obstacleMillis = millis();

      avoidingObstacle = true;

      digitalWrite(buzzerPin, HIGH);
    }
  }

  // No obstacle

  else
  {
    digitalWrite(buzzerPin, LOW);
  }

  // Automatic forward recovery

  if (avoidingObstacle &&
      millis() - obstacleMillis >= backwardDuration)
  {
    forward();

    avoidingObstacle = false;
  }
}

// =====================================================
// SEED MECHANISM
// =====================================================

void seedMechanism()
{
  if (seedMode)
  {
    unsigned long now = millis();

    if (now - previousMillis >= seedInterval)
    {
      previousMillis = now;

      if (seedPosition)
      {
        seedServo.write(60);
      }
      else
      {
        seedServo.write(120);
      }

      seedPosition = !seedPosition;
    }
  }
}

// =====================================================
// SEND SENSOR DATA
// =====================================================

void sendSensorData()
{
  unsigned long now = millis();

  if (now - lastSendTime >= sensorInterval)
  {
    lastSendTime = now;

    float temperature = dht.readTemperature();
    float humidity = dht.readHumidity();

    int soilValue = analogRead(soilSensor);

    float battery = readBatteryVoltage();

    if (!isnan(temperature) && !isnan(humidity))
    {
      // Send data through HC-05

      Serial1.print(temperature, 2);
      Serial1.print(",");

      Serial1.print(humidity, 2);
      Serial1.print(",");

      Serial1.print(soilValue);
      Serial1.print(",");

      Serial1.print(battery, 2);

      Serial1.println("");

      // Display data on computer

      Serial.print("Temperature: ");
      Serial.print(temperature, 2);

      Serial.print(" C | Humidity: ");
      Serial.print(humidity, 2);

      Serial.print(" % | Soil: ");
      Serial.print(soilValue);

      Serial.print(" | Battery: ");
      Serial.print(battery, 2);

      Serial.println(" V");
    }
    else
    {
      Serial.println("DHT11 reading failed!");
    }
  }
}

// =====================================================
// MAIN LOOP
// =====================================================

void loop()
{
  // Bluetooth control

  handleBluetooth();

  // Obstacle detection

  obstacleDetection();

  // Seed mechanism

  seedMechanism();

  // Sensor data

  sendSensorData();

  // GPS

  readGPS();
}