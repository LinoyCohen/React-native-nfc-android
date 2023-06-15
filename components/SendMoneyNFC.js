import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Button,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NfcManager, { NfcEvents, NfcTech } from "react-native-nfc-manager";
import axios from "axios";
import HorizontalLine from "./HorizontalLine";

const SendMoneyNFC = ({ navigation }) => {
  const [emails, setEmails] = useState([]);
  const [chosenEmail, setChosenEmail] = useState("Unknown");
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");

  const instance = axios.create({
    baseURL: "https://easy-pay.onrender.com",
  });

  useEffect(() => {
    instance
      .get("/nfc")
      .then((response) => {
        console.log(response.data);
        setBalance(response.data.user.balance.amount);
        setCurrency(response.data.user.balance.currency.currencySymbol);
        console.log(AsyncStorage.getItem("@token"));
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    NfcManager.start();
    NfcManager.setEventListener(NfcEvents.DiscoverTag, handleDiscoverTag);

    return () => {
      NfcManager.setEventListener(NfcEvents.DiscoverTag, null);
      NfcManager.unregisterTagEvent();
      NfcManager.stop();
    };
  }, []);

  const getMoneyHandler = () => {
    navigation.navigate("getmoney");
  };

  const handleDiscoverTag = async (tag) => {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef, {
        alertMessage: "Hold your devices together to receive data.",
      });

      const message = NfcManager.ndef.encodeMessage([
        NfcManager.ndef.textRecord("Hello, NFC World!"),
      ]);

      await NfcManager.ndef.write(message);

      console.log("Data sent successfully via NFC!");
    } catch (error) {
      console.warn("Error sending data via NFC:", error);
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleLogo}>EasyPay.</Text>
      </View>

      <View style={styles.container}>
        <ScrollView>
          <View style={styles.NFContainer}>
            <Text style={styles.balance}>Your Balance</Text>
            <Text style={styles.amount}>
              {balance.toLocaleString()} {currency}
            </Text>
            <Text style={styles.howMuch}>Transfer Money</Text>
            <View>
              <TextInput
                style={styles.input}
                placeholder="Enter the amount"
              ></TextInput>
              <Button
                color="#121f3e"
                title="Transfer"
                onPress={handleDiscoverTag}
              ></Button>
              <View>
                <HorizontalLine />
              </View>

              <Text style={styles.getMoney}>Need to get money?</Text>
              <Button
                color="#121f3e"
                title="Click here"
                onPress={getMoneyHandler}
              ></Button>
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default SendMoneyNFC;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    flex: 1,
    backgroundColor: "#e9f0f3",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    color: "#121f3e",
    fontSize: 22,
    fontWeight: "bold",
    padding: 30,
    marginTop: 10,
    alignSelf: "baseline",
  },
  titleContainer: {
    backgroundColor: "white",
    width: "100%",
    alignItems: "flex-end",
  },
  titleLogo: {
    padding: 25,
    color: "#1a667a",
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "left",
    writingDirection: "ltr",
  },
  NFContainer: {
    height: "80%",
    alignItems: "center",
  },
  howMuch: {
    color: "#121f3e",
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    paddingTop: 40,
    paddingBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e8e8e8",
    marginBottom: 10,
    padding: 10,
    width: 220,
    textAlign: "center",
    borderRadius: 6,
    backgroundColor: "white",
  },
  balance: {
    color: "#1a667a",
    fontSize: 24,
    fontWeight: "bold",
    paddingTop: 20,
  },
  amount: {
    fontSize: 34,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  getMoney: {
    fontSize: 16,
    fontWeight: "bold",
    padding: 10,
    alignSelf: "center",
  },
});
