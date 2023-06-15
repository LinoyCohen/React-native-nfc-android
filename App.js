import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet, Text, View } from "react-native";
import {Provider as PaperProvider} from "react-native-paper";

import AppNavigator from "./components/AppNavigator";

const Stack = createStackNavigator();

function App() {
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

