import { useState, useEffect } from "react";
import { View, Text, StyleSheet, Button, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NfcManager, { NfcEvents, NfcTech } from "react-native-nfc-manager";
import axios from "axios";

import HorizontalLine from "./HorizontalLine";

const GetMoneyNFC = () => {
  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");
  const [receivedData, setReceivedData] = useState(null);

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

  const handleDiscoverTag = async (tag) => {
    try {
      const ndef = await NfcManager.parseAndroidNdefIntent(tag);
      if (ndef && ndef.length > 0) {
        const payload = ndef[0].payload;
        const text = Ndef.text.decodePayload(payload);

        setReceivedData(text);
        console.log("Data received via NFC:", text);
      }
    } catch (error) {
      console.warn("Error receiving data via NFC:", error);
    }
  };

  const handleNfcReading = () => {
    NfcManager.registerTagEvent();
  };

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.titleLogo}>EasyPay.</Text>
      </View>

      <View style={styles.container}>
        <View style={styles.NFContainer}>
          <Text style={styles.balance}>Your Balance</Text>
          <Text style={styles.amount}>
            {balance.toLocaleString()} {currency}
          </Text>
          <Text style={styles.receive}>Receive money</Text>
          <Button
            style={styles.button}
            color="#121f3e"
            title="Get the Money"
            onPress={handleNfcReading}
          />
          <Text>Received Data: {receivedData}</Text>
        </View>
      </View>
    </View>
  );
};

export default GetMoneyNFC;

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
  balance: {
    color: "#1a667a",
    fontSize: 24,
    fontWeight: "bold",
  },
  amount: {
    fontSize: 34,
    textAlign: "center",
    marginTop: 10,
    fontWeight: "bold",
  },
  receive: {
    paddingTop: 30,
    paddingBottom: 10,
    fontWeight: "bold",
    fontSize: 20,
    color: "#121f3e",
  },
});
