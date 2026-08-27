import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { Card } from "react-native-paper";


export default function AboutScreen(){

  return(

    <ScrollView style={styles.container}>


      <Text style={styles.title}>
        ℹ️ About
      </Text>



      <Card style={styles.card}>

        <Text style={styles.projectTitle}>
          🌾 Smart Agriculture Rover
        </Text>


        <Text style={styles.description}>
          An intelligent agricultural rover designed to assist farmers
          through automated monitoring, remote control, and smart
          farming solutions.
        </Text>


      </Card>





      <Card style={styles.card}>


        <Text style={styles.heading}>
          🚜 Features
        </Text>


        <Text style={styles.item}>
          ✅ Remote Rover Control
        </Text>


        <Text style={styles.item}>
          ✅ Real-time Sensor Monitoring
        </Text>


        <Text style={styles.item}>
          ✅ Soil Condition Analysis
        </Text>


        <Text style={styles.item}>
          ✅ Automated Agriculture Assistance
        </Text>


      </Card>






      <Card style={styles.card}>


        <Text style={styles.heading}>
          💻 Technology Stack
        </Text>


        <Text style={styles.item}>
          📱 Mobile App: React Native Expo
        </Text>


        <Text style={styles.item}>
          🐍 Backend: Python Flask
        </Text>


        <Text style={styles.item}>
          🤖 Hardware: ESP32
        </Text>


        <Text style={styles.item}>
          📡 Communication: WiFi
        </Text>


      </Card>






      <Card style={styles.card}>


        <Text style={styles.heading}>
          🌱 Project Goal
        </Text>


        <Text style={styles.description}>
          To provide farmers with an affordable smart farming
          assistant that improves monitoring efficiency and reduces
          manual effort.
        </Text>


      </Card>



    </ScrollView>

  );

}




const styles = StyleSheet.create({


container:{
 flex:1,
 backgroundColor:"#F2F8F1",
 padding:20,
},


title:{
 fontSize:26,
 fontWeight:"bold",
 color:"#2E7D32",
 marginTop:20,
 marginBottom:20,
},


card:{
 padding:20,
 marginBottom:15,
 borderRadius:18,
 elevation:3,
},


projectTitle:{
 fontSize:22,
 fontWeight:"bold",
 color:"#2E7D32",
 marginBottom:10,
},


heading:{
 fontSize:18,
 fontWeight:"bold",
 marginBottom:12,
},


description:{
 fontSize:16,
 lineHeight:24,
},


item:{
 fontSize:16,
 marginBottom:8,
},


});