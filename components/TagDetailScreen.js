import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ndef } from "react-native-nfc-manager";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

function TagDetailScreen(props) {
  const { route } = props;
  const { tag } = route.params;
  let uri = null;

  const instance = axios.create({
    baseURL: "https://easy-pay.onrender.com",
  });

  useEffect(() => {
    instance
      .patch("/charge-balance", {
        amount: uri.split("//")[1],
      })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, [uri]);

  if (tag.ndefMessage && tag.ndefMessage.length > 0) {
    const ndefRecord = tag.ndefMessage[0];
    if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
      if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_URI[i])) {
        uri = Ndef.uri.decodePayload(ndefRecord.payload);
      }
    }
  }

  return (
    <View style={styles.wrapper}>
      <Text style={styles.gotMoney}>You have got</Text>
      <Text style={styles.amount}>{uri.split("//")[1]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  gotMoney: {
    color: "#121f3e",
    fontSize: 32,
    fontWeight: "bold",
    paddingBottom: 15,
  },
  amount: {
    fontSize: 24,
  },
});

export default TagDetailScreen;
