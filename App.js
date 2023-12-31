import { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import {Provider as PaperProvider} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

import AppNavigator from "./components/AppNavigator";

const Stack = createStackNavigator();

function App() {
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
		<PaperProvider>
			<AppNavigator />
		</PaperProvider>
	)
}

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});

