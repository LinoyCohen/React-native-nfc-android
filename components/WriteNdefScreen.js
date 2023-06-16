import React, { useRef } from "react";
import { View, StyleSheet, SafeAreaView, Platform } from "react-native";
import { Chip } from "react-native-paper";
import { TextInput, Button } from "react-native";
import NfcManager, { Ndef, NfcTech } from "react-native-nfc-manager";
import AndroidPrompt from "./UI/AndroidPrompt";
import axios from "axios";

function WriteNdefScreen(props) {
  const [selectedLinkType, setSelectedLinkType] = React.useState("WEB");
  const [value, setValue] = React.useState("");
  const androidPromptRef = useRef();

  const instance = axios.create({
    baseURL: "https://easy-pay.onrender.com",
  });

  //    useEffect(() => {
  //     instance
  //             .patch("/withdraw-balance", {
  //               amount: value,
  //             })
  //             .then((response) => {
  //               console.log(response.data);
  //               setAmountError([]);
  //             })
  //             .catch((error) => {
  //               console.log(error);
  //             });
  //    }, [])

  async function writeNdef() {
    androidPromptRef.current.setVisible(true);
    let scheme = null;
    if (selectedLinkType === "WEB") {
      scheme = "https://";
    } else if (selectedLinkType === "TEL") {
      scheme = "tel:";
    } else if (selectedLinkType === "TEXT") {
      scheme = "https://";
    } else if (selectedLinkType === "EMAIL") {
      scheme = "mailto:";
    } else {
      throw new Error("no such type");
    }
    const uriRecord = Ndef.uriRecord(`https://${value}`);
    const bytes = Ndef.encodeMessage([uriRecord]);
    //     console.warn(bytes);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
      instance
        .patch("/withdraw-balance", {
          amount: value,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (ex) {
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
      androidPromptRef.current.setVisible(false);
    }
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView />
      <View style={[styles.wrapper, styles.pad]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          autoCapitalize="sentences"
          style={styles.input}
          placeholder="Enter the amount to transfer"
        />
        <Button onPress={writeNdef} title="WRITE" color="#1a667a"></Button>
        <SafeAreaView style={styles.bgLight} />
      </View>
      <AndroidPrompt
        ref={androidPromptRef}
        onCancelPress={() => {
          NfcManager.cancelTechnologyRequest();
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: "center",
  },
  pad: {
    padding: 40,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  bottom: {
    padding: 10,
    alignItems: "center",
    color: "white",
  },
  bgLight: {
    backgroundColor: "#1a667a",
    color: "white",
  },
  input: {
    backgroundColor: "white",
    marginBottom: 20,
  },
});

export default WriteNdefScreen;
