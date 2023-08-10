import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import { createStackNavigator } from "@react-navigation/stack";
import * as SplashScreen from "expo-splash-screen";
import { usePoppins } from "styles/theme";
import React from "react";

const StackNavigator = createStackNavigator();
SplashScreen.preventAutoHideAsync();

export default function App() {
  const fontsLoaded = usePoppins();

  React.useEffect(() => {
    const hideSplashScreen = async (): Promise<void> => {
      await SplashScreen.hideAsync();
    };

    if (fontsLoaded) {
      hideSplashScreen();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
