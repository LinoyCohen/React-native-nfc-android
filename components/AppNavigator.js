import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useEffect, useState } from "react";
import { Provider as PaperProvider } from "react-native-paper";

import Login from "./Login";
import NewNFC from "./NewNFC";
import TagDetailScreen from "./TagDetailScreen";
import WriteNdefScreen from "./WriteNdefScreen";

const Stack = createStackNavigator();

function AppNavigator() {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const getToken = async () => {
      const storedToken = await AsyncStorage.getItem("@token");
      if (storedToken) {
        setToken(storedToken);
        axios.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${storedToken}`;
      }
    };
    getToken();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="nfc"
          component={NewNFC}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Tag"
          component={TagDetailScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Write"
          component={WriteNdefScreen}
          options={{ headerShown: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default AppNavigator;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
