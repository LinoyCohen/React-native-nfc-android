import axios from "axios";
import { useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Button,
  Image,
  StyleSheet,
  Text,
  TextInput,
  View,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

const Login = ({ navigation }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [enteredEmail, setEnteredEmail] = useState("");
  const [enteredPassword, setEnteredPassword] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  const instance = axios.create({
    baseURL: "https://easy-pay.onrender.com",
  });

  const handleEmailHandler = (enteredEmail) => {
    setEnteredEmail(enteredEmail);
  };

  const handlePasswordHandler = (enteredPassword) => {
    setEnteredPassword(enteredPassword);
  };

  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  const setToken = async (token) => {
    try {
      await AsyncStorage.setItem("@token", token);
    } catch (e) {
      console.log("did not work");
    }
  };

  const submitHandler = () => {
    console.log(enteredEmail);
    console.log(enteredPassword);

    instance
      .post("/login", {
        email: enteredEmail,
        password: enteredPassword,
      })
      .then(async (response) => {
        if (response.data.status === "success") {
          console.log(response.data);
          const token = response.data.token;
          await setToken(token);
		  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
          setIsLoggedIn(true);
          setEnteredEmail("");
          setEnteredPassword("");
          navigation.navigate("nfc");
        }
      })
      .catch((error) => {
        setIsCorrect(true);
        console.log("email or password incorrect");
      });
  };


  return (
    <TouchableWithoutFeedback onPress={dismissKeyboard}>
      <View style={styles.loginPage}>
        <Text style={styles.title}>EasyPay.</Text>
        <View style={styles.loginContainer}>
          <Image
            style={styles.backImg}
            source={require("../assets/new-logo.jpeg")}
          />
          <View>
            <Text style={styles.login}>Log in</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter Your Email"
              onChangeText={handleEmailHandler}
              value={enteredEmail}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Your Password"
              secureTextEntry={true}
              onChangeText={handlePasswordHandler}
              value={enteredPassword}
            />
            <Button color="#1a667a" title="Sign In" onPress={submitHandler} />
          </View>
          {isCorrect && (
            <View>
              <Text style={styles.incorrect}>
                Incorrect Email or Password! Please try again.
              </Text>
            </View>
          )}
          {isLoggedIn && (
            <View>
              <Text style={styles.correct}>Log In Successfully!</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default Login;

const styles = StyleSheet.create({
  loginPage: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#fff",
    // alignItems: "center",
    // justifyContent: "center",
  },
  loginContainer: {
    alignItems: "center",
  },
  backImg: {
    width: 350,
    height: 250,
    marginBottom: 8,
  },
  title: {
    padding: 30,
    marginTop: 10,
    color: "#1a667a",
    fontSize: 24,
    fontWeight: "bold",
    // fontFamily: "Poppins-Bold",
  },
  login: {
    color: "#1a667a",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    marginBottom: 10,
    padding: 8,
    width: 200,
    textAlign: "center",
    borderRadius: 6,
  },
  footer: {
    position: "absolute",
    bottom: 2,
    left: 0,
    right: 0,
    color: "#bdbdbd",
    padding: 10,
    textAlign: "center",
  },
  incorrect: {
    color: "red",
  },
  correct: {
    color: "#046af9",
  },
});
