import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import NfcManager, { NfcEvents, Ndef, NfcTech } from "react-native-nfc-manager";
import AndroidPrompt from "././UI/AndroidPrompt";
import HorizontalLine from "./HorizontalLine";

const NFC = () => {
  const [amount, setAmount] = useState("");

  useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
      }
    }
  }, []);

  //   const scanTag = async () => {
  //     console.log(amount);
  //     NfcManager.setEventListener(NfcEvents.DiscoverTag, (tag) => {
  //       console.warn("tag found here", tag.payload);
  //     });
  //     await NfcManager.registerTagEvent();
  //   };

  async function readNdef() {
    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      if (tag.ndefMessage && tag.ndefMessage.length > 0) {
          const ndefRecord = tag.ndefMessage[0];
          if (ndefRecord.tnf === Ndef.TNF_WELL_KNOWN) {
            if (ndefRecord.type.every((b, i) => b === Ndef.RTD_BYTES_URI[i])) {
              uri = Ndef.uri.decodePayload(ndefRecord.payload);
              console.log(uri)
            }
          }
        }
    } catch (ex) {
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  const writeToTag = () => {
    const textRecord = Ndef.textRecord("hello world");
    const bytes = Ndef.encodeMessage([textRecord]);
    console.log(bytes);
  };

  return (
    <View style={styles.wrapper}>
      <Text>Transfer Money</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter the amount"
        onChangeText={setAmount}
        value={amount}
      ></TextInput>
      <TouchableOpacity style={styles.btn} onPress={readNdef}>
        <Text>Write</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={writeToTag}>
        <Text>Write</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NFC;

const styles = StyleSheet.create({
  btn: {
    margin: 15,
    padding: 15,
    borderRadius: 8,
    backgroundColor: "#ccc",
  },
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
});
