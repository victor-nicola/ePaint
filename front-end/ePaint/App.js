import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import LogIn from "./assets/screens/logIn";
import AuthStack from './routes/AuthStack';

export default function App() {
  return (
    <View style={styles.container}>
      <AuthStack />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});
