from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv
from datetime import datetime, timezone

import bcrypt
import os
import joblib
import numpy as np


# ============================================================
# LOAD ENVIRONMENT VARIABLES
# ============================================================

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise RuntimeError(
        "MONGO_URI is missing. Check Backend/.env"
    )


# ============================================================
# FLASK APP
# ============================================================

app = Flask(__name__)

CORS(app)


# ============================================================
# MONGODB ATLAS
# ============================================================

try:

    client = MongoClient(
        MONGO_URI,
        tls=True,
        serverSelectionTimeoutMS=10000,
        connectTimeoutMS=10000,
        socketTimeoutMS=10000
    )

    client.admin.command("ping")

    db = client["SmartAgricultureRover"]

    users_collection = db["users"]
    predictions_collection = db["predictions"]
    sensor_collection = db["sensor_data"]

    print("MongoDB Atlas connected successfully!")

except Exception as e:

    print("MongoDB connection failed:")
    print(e)

    client = None
    db = None

    users_collection = None
    predictions_collection = None
    sensor_collection = None


# ============================================================
# LOAD ML MODELS
# ============================================================

ML_MODEL_PATH = os.path.join(
    os.path.dirname(os.path.dirname(__file__)),
    "ML_Model"
)


# ============================================================
# MODEL 1 - FULL MODEL
#
# INPUTS:
# N
# P
# K
# temperature
# humidity
# ph
# rainfall
# ============================================================

FULL_MODEL_PATH = os.path.join(
    ML_MODEL_PATH,
    "crop_model_full.pkl"
)

try:

    full_model = joblib.load(
        FULL_MODEL_PATH
    )

    print(
        "Full crop model loaded successfully!"
    )

except Exception as e:

    print(
        "Could not load full crop model:"
    )

    print(e)

    full_model = None


# ============================================================
# MODEL 2 - SENSOR ONLY MODEL
#
# INPUTS:
# temperature
# humidity
#
# IMPORTANT:
# Soil moisture can be DISPLAYED in the app,
# but it is NOT an ML input because the training
# dataset did not contain soil moisture.
# ============================================================

BASIC_MODEL_PATH = os.path.join(
    ML_MODEL_PATH,
    "crop_model_basic.pkl"
)

try:

    basic_model = joblib.load(
        BASIC_MODEL_PATH
    )

    print(
        "Basic crop model loaded successfully!"
    )

except Exception as e:

    print(
        "Could not load basic crop model:"
    )

    print(e)

    basic_model = None


# ============================================================
# HOME
# ============================================================

@app.route("/", methods=["GET"])
def home():

    return jsonify({
        "message":
        "Smart Agriculture Rover API Running"
    })


# ============================================================
# REGISTER
# ============================================================

@app.route("/register", methods=["POST"])
def register():

    try:

        if users_collection is None:

            return jsonify({
                "message":
                "Database connection unavailable"
            }), 500


        data = request.get_json()


        if not data:

            return jsonify({
                "message":
                "No data received"
            }), 400


        name = data.get(
            "name",
            ""
        ).strip()


        username = data.get(
            "username",
            ""
        ).strip()


        email = data.get(
            "email",
            ""
        ).strip().lower()


        phone = data.get(
            "phone",
            ""
        ).strip()


        password = data.get(
            "password",
            ""
        )


        if (
            not name
            or not username
            or not email
            or not password
        ):

            return jsonify({
                "message":
                "Name, username, email and password are required"
            }), 400


        existing_user = users_collection.find_one({

            "$or": [

                {
                    "email":
                    email
                },

                {
                    "username":
                    username
                }

            ]

        })


        if existing_user:

            if existing_user.get(
                "email"
            ) == email:

                return jsonify({
                    "message":
                    "Email already registered"
                }), 409


            return jsonify({
                "message":
                "Username already exists"
            }), 409


        password_hash = bcrypt.hashpw(

            password.encode(
                "utf-8"
            ),

            bcrypt.gensalt()

        ).decode(
            "utf-8"
        )


        user = {

            "name":
            name,

            "username":
            username,

            "email":
            email,

            "phone":
            phone,

            "passwordHash":
            password_hash,

            "theme":
            "system",

            "language":
            "English",

            "createdAt":
            datetime.now(
                timezone.utc
            )

        }


        result = users_collection.insert_one(
            user
        )


        return jsonify({

            "message":
            "Account created successfully",

            "userId":
            str(result.inserted_id)

        }), 201


    except Exception as e:

        print(
            "Register error:",
            e
        )

        return jsonify({

            "message":
            "Registration failed",

            "error":
            str(e)

        }), 500


# ============================================================
# LOGIN
# ============================================================

@app.route("/login", methods=["POST"])
def login():

    try:

        if users_collection is None:

            return jsonify({
                "message":
                "Database connection unavailable"
            }), 500


        data = request.get_json()


        if not data:

            return jsonify({
                "message":
                "No data received"
            }), 400


        email = data.get(
            "email",
            ""
        ).strip().lower()


        password = data.get(
            "password",
            ""
        )


        if not email or not password:

            return jsonify({
                "message":
                "Email and password are required"
            }), 400


        user = users_collection.find_one({

            "email":
            email

        })


        if not user:

            return jsonify({
                "message":
                "Invalid email or password"
            }), 401


        password_valid = bcrypt.checkpw(

            password.encode(
                "utf-8"
            ),

            user[
                "passwordHash"
            ].encode(
                "utf-8"
            )

        )


        if not password_valid:

            return jsonify({
                "message":
                "Invalid email or password"
            }), 401


        return jsonify({

            "message":
            "Login successful",

            "user": {

                "id":
                str(
                    user["_id"]
                ),

                "name":
                user.get(
                    "name",
                    ""
                ),

                "username":
                user.get(
                    "username",
                    ""
                ),

                "email":
                user.get(
                    "email",
                    ""
                ),

                "phone":
                user.get(
                    "phone",
                    ""
                ),

                "theme":
                user.get(
                    "theme",
                    "system"
                ),

                "language":
                user.get(
                    "language",
                    "English"
                )

            }

        }), 200


    except Exception as e:

        print(
            "Login error:",
            e
        )

        return jsonify({

            "message":
            "Login failed",

            "error":
            str(e)

        }), 500


# ============================================================
# CROP PREDICTION
# ============================================================

@app.route("/predict", methods=["POST"])
def predict():

    try:

        data = request.get_json()


        if not data:

            return jsonify({
                "message":
                "No input data received"
            }), 400


        # ====================================================
        # TEMPERATURE + HUMIDITY
        # REQUIRED BY BOTH MODELS
        # ====================================================

        if (
            "temperature" not in data
            or "humidity" not in data
        ):

            return jsonify({
                "message":
                "Temperature and humidity are required"
            }), 400


        try:

            temperature = float(
                data["temperature"]
            )

            humidity = float(
                data["humidity"]
            )

        except (
            TypeError,
            ValueError
        ):

            return jsonify({
                "message":
                "Temperature and humidity must be valid numbers"
            }), 400


        if not all(
            np.isfinite(value)
            for value in [
                temperature,
                humidity
            ]
        ):

            return jsonify({
                "message":
                "Temperature and humidity cannot be NaN or Infinity"
            }), 400


        # ====================================================
        # CHECK WHETHER FULL MODEL DATA WAS SENT
        # ====================================================

        full_fields = [
            "N",
            "P",
            "K",
            "ph",
            "rainfall"
        ]


        has_full_inputs = all(

            field in data
            and data[field] not in [
                None,
                ""
            ]

            for field in full_fields

        )


        # ====================================================
        # MODEL 1 - FULL 7 VALUE MODEL
        # ====================================================

        if has_full_inputs:

            print(
                "Using FULL crop model"
            )


            if full_model is None:

                return jsonify({
                    "message":
                    "Full crop prediction model is not loaded"
                }), 500


            try:

                N = float(
                    data["N"]
                )

                P = float(
                    data["P"]
                )

                K = float(
                    data["K"]
                )

                ph = float(
                    data["ph"]
                )

                rainfall = float(
                    data["rainfall"]
                )

            except (
                TypeError,
                ValueError
            ):

                return jsonify({
                    "message":
                    "N, P, K, pH and rainfall must be valid numbers"
                }), 400


            full_values = [

                N,
                P,
                K,
                temperature,
                humidity,
                ph,
                rainfall

            ]


            if not all(
                np.isfinite(value)
                for value in full_values
            ):

                return jsonify({
                    "message":
                    "Prediction values cannot be NaN or Infinity"
                }), 400


            # =================================================
            # MODEL 1 INPUT ORDER
            #
            # N
            # P
            # K
            # temperature
            # humidity
            # ph
            # rainfall
            # =================================================

            features = np.array([[

                N,
                P,
                K,
                temperature,
                humidity,
                ph,
                rainfall

            ]])


            print(
                "Full model input:",
                features
            )


            prediction = full_model.predict(
                features
            )


            crop = str(
                prediction[0]
            )


            model_used = "full"


            if predictions_collection is not None:

                prediction_record = {

                    "N":
                    N,

                    "P":
                    P,

                    "K":
                    K,

                    "temperature":
                    temperature,

                    "humidity":
                    humidity,

                    "ph":
                    ph,

                    "rainfall":
                    rainfall,

                    "predictedCrop":
                    crop,

                    "modelUsed":
                    model_used,

                    "timestamp":
                    datetime.now(
                        timezone.utc
                    )

                }


                predictions_collection.insert_one(
                    prediction_record
                )


            return jsonify({

                "crop":
                crop,

                "modelUsed":
                model_used

            }), 200


        # ====================================================
        # MODEL 2 - SENSOR ONLY MODEL
        #
        # ONLY:
        # temperature
        # humidity
        #
        # Soil moisture is displayed in the mobile app
        # but is NOT passed to this ML model.
        # ====================================================

        else:

            print(
                "Using SENSOR-ONLY crop model"
            )


            if basic_model is None:

                return jsonify({
                    "message":
                    "Sensor-only crop prediction model is not loaded"
                }), 500


            features = np.array([[

                temperature,
                humidity

            ]])


            print(
                "Sensor-only model input:",
                features
            )


            prediction = basic_model.predict(
                features
            )


            crop = str(
                prediction[0]
            )


            model_used = "sensor_only"


            if predictions_collection is not None:

                prediction_record = {

                    "N":
                    None,

                    "P":
                    None,

                    "K":
                    None,

                    "temperature":
                    temperature,

                    "humidity":
                    humidity,

                    "ph":
                    None,

                    "rainfall":
                    None,

                    "predictedCrop":
                    crop,

                    "modelUsed":
                    model_used,

                    "timestamp":
                    datetime.now(
                        timezone.utc
                    )

                }


                predictions_collection.insert_one(
                    prediction_record
                )


            return jsonify({

                "crop":
                crop,

                "modelUsed":
                model_used

            }), 200


    except Exception as e:

        print(
            "Prediction error:",
            e
        )

        return jsonify({

            "message":
            "Prediction failed",

            "error":
            str(e)

        }), 500


# ============================================================
# PREDICTION HISTORY
# ============================================================

@app.route("/history", methods=["GET"])
def history():

    try:

        if predictions_collection is None:

            return jsonify({
                "message":
                "Database connection unavailable"
            }), 500


        records = (

            predictions_collection

            .find()

            .sort(
                "timestamp",
                -1
            )

            .limit(50)

        )


        history_data = []


        for record in records:

            history_data.append({

                "id":
                str(
                    record["_id"]
                ),

                "temperature":
                record.get(
                    "temperature"
                ),

                "humidity":
                record.get(
                    "humidity"
                ),

                "ph":
                record.get(
                    "ph"
                ),

                "rainfall":
                record.get(
                    "rainfall"
                ),

                "predictedCrop":
                record.get(
                    "predictedCrop"
                ),

                "modelUsed":
                record.get(
                    "modelUsed"
                ),

                "timestamp":

                record.get(
                    "timestamp"
                ).isoformat()

                if record.get(
                    "timestamp"
                )

                else None

            })


        return jsonify({
            "history":
            history_data
        }), 200


    except Exception as e:

        print(
            "History error:",
            e
        )

        return jsonify({

            "message":
            "Could not retrieve history",

            "error":
            str(e)

        }), 500


# ============================================================
# SENSOR DATA
# ============================================================

@app.route("/sensors", methods=["GET"])
def sensors():

    try:

        # Temporary Flask sensor values.
        #
        # Real rover values are now received directly
        # by the mobile app over HC-05 Bluetooth.

        sensor_data = {

            "temperature":
            28.5,

            "humidity":
            65.0,

            "ph":
            6.5,

            "soilMoisture":
            72.0,

            "battery":
            85.0,

            "timestamp":
            datetime.now(
                timezone.utc
            )

        }


        if sensor_collection is not None:

            sensor_collection.insert_one(
                sensor_data.copy()
            )


        response_data = sensor_data.copy()


        response_data[
            "timestamp"
        ] = response_data[
            "timestamp"
        ].isoformat()


        return jsonify(
            response_data
        ), 200


    except Exception as e:

        print(
            "Sensor error:",
            e
        )

        return jsonify({

            "message":
            "Could not retrieve sensor data",

            "error":
            str(e)

        }), 500


# ============================================================
# SENSOR HISTORY
# ============================================================

@app.route(
    "/sensor-history",
    methods=["GET"]
)
def sensor_history():

    try:

        if sensor_collection is None:

            return jsonify({
                "message":
                "Database connection unavailable"
            }), 500


        records = (

            sensor_collection

            .find()

            .sort(
                "timestamp",
                -1
            )

            .limit(50)

        )


        history = []


        for record in records:

            history.append({

                "id":
                str(
                    record["_id"]
                ),

                "temperature":
                record.get(
                    "temperature"
                ),

                "humidity":
                record.get(
                    "humidity"
                ),

                "soilMoisture":
                record.get(
                    "soilMoisture"
                ),

                "battery":
                record.get(
                    "battery"
                ),

                "timestamp":

                record[
                    "timestamp"
                ].isoformat()

            })


        return jsonify({
            "history":
            history
        }), 200


    except Exception as e:

        print(
            "Sensor history error:",
            e
        )

        return jsonify({

            "message":
            "Could not retrieve sensor history",

            "error":
            str(e)

        }), 500


# ============================================================
# ROVER CONTROL
# ============================================================

@app.route(
    "/control",
    methods=["POST"]
)
def control():

    try:

        data = request.get_json()


        if not data:

            return jsonify({
                "message":
                "No command received"
            }), 400


        command = data.get(
            "command",
            ""
        ).strip().lower()


        allowed_commands = [

            "forward",
            "backward",
            "left",
            "right",
            "stop"

        ]


        if command not in allowed_commands:

            return jsonify({
                "message":
                "Invalid rover command"
            }), 400


        print(
            f"ROVER COMMAND RECEIVED: "
            f"{command.upper()}"
        )


        return jsonify({

            "message":
            "Command received successfully",

            "command":
            command,

            "status":
            "accepted"

        }), 200


    except Exception as e:

        print(
            "Control error:",
            e
        )

        return jsonify({

            "message":
            "Could not process rover command",

            "error":
            str(e)

        }), 500


# ============================================================
# GPS DATA
# ============================================================

@app.route(
    "/gps",
    methods=["GET"]
)
def get_gps():

    try:

        gps_data = {

            "latitude":
            None,

            "longitude":
            None,

            "altitude":
            None,

            "satellites":
            0,

            "timestamp":
            None,

            "status":
            "waiting"

        }


        return jsonify(
            gps_data
        ), 200


    except Exception as e:

        print(
            "GPS error:",
            e
        )

        return jsonify({

            "message":
            "Could not retrieve GPS data",

            "error":
            str(e)

        }), 500


# ============================================================
# ULTRASONIC DISTANCE
# ============================================================

@app.route(
    "/distance",
    methods=["GET"]
)
def get_distance():

    try:

        # Temporary Flask value.
        # Real distance comes directly through HC-05.

        distance = 45.5


        if distance < 20:

            status = "obstacle"

        else:

            status = "clear"


        return jsonify({

            "distance":
            distance,

            "status":
            status

        }), 200


    except Exception as e:

        print(
            "Distance error:",
            e
        )

        return jsonify({

            "message":
            "Could not retrieve distance",

            "error":
            str(e)

        }), 500


# ============================================================
# RUN SERVER
# ============================================================

if __name__ == "__main__":

    app.run(

        host="0.0.0.0",

        port=5000,

        debug=True

    )