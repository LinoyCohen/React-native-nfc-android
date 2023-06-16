import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Button } from "react-native-paper";
import axios from "axios";
import NfcManager, { NfcTech } from "react-native-nfc-manager";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AndroidPrompt from "./UI/AndroidPrompt";

function NewNFC(props) {
  const { navigation } = props;
  const [hasNfc, setHasNfc] = useState(null);
  const [enabled, setEnabled] = useState(null);
  const androidPromptRef = useRef();

  const [balance, setBalance] = useState("");
  const [currency, setCurrency] = useState("");
  const [refreshing, setRefreshing] = useState(false);
  const [token, setToken] = useState("");

  const instance = axios.create({
    baseURL: "https://easy-pay.onrender.com",
  });

  useEffect(() => {
    async function checkNfc() {
      const supported = await NfcManager.isSupported();
      if (supported) {
        await NfcManager.start();
        setEnabled(await NfcManager.isEnabled());
      }
      setHasNfc(supported);
    }
    checkNfc();
  }, []);

  const fetchData = () => {
    instance
      .get("/nfc")
      .then(async(response) => {
        console.log(response.data);
        setBalance(response.data.user.balance.amount);
        setCurrency(response.data.user.balance.currency.currencySymbol);
        console.log(await AsyncStorage.getItem("@token"));
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  async function readNdef() {
    try {
      androidPromptRef.current.setVisible(true);
      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();
      navigation.navigate("Tag", { tag });
    } catch (ex) {
      //nothing
    } finally {
      NfcManager.cancelTechnologyRequest();
      androidPromptRef.current.setVisible(false);
    }
  }

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("@token");
      navigation.navigate("Login", {token});
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
    setRefreshing(false);
  };

  function renderNfcButtons() {
    if (hasNfc === null) {
      return null;
    } else if (!hasNfc) {
      return (
        <View style={styles.wrapper}>
          <Text>You device doesn't support NFC</Text>
        </View>
      );
    } else if (!enabled) {
      // only for Android
      return (
        <View style={styles.wrapper}>
          <Text>Your NFC is not enabled!</Text>

          <TouchableOpacity
            onPress={() => {
              NfcManager.goToNfcSetting();
            }}
          >
            <Text>GO TO NFC SETTINGS</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={async () => {
              setEnabled(await NfcManager.isEnabled());
            }}
          >
            <Text>CHECK AGAIN</Text>
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <View style={styles.bottom}>
        <Button
          mode="contained"
          style={[styles.btn]}
          onPress={() => {
            readNdef();
          }}
        >
          GET MONEY
        </Button>
        <Button
          mode="contained"
          style={styles.btn}
          onPress={() => {
            navigation.navigate("Write");
          }}
        >
          TRANSFER MONEY
        </Button>
        <AndroidPrompt
          ref={androidPromptRef}
          onCancelPress={() => {
            NfcManager.cancelTechnologyRequest();
          }}
        />
        <Button mode="contained" style={[styles.logout]} onPress={handleLogout}>
          Log Out
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.wrapper}>
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.wrapper}>
          <Text style={styles.bannerText}>Your Balance</Text>
          <Text style={styles.amount}>
            {currency}
            {balance.toLocaleString()}
          </Text>
          {renderNfcButtons()}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bannerText: {
    fontSize: 22,
    textAlign: "center",
  },
  bottom: {
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  btn: {
    width: 250,
    marginBottom: 15,
    backgroundColor: "#1a667a",
  },
  logout: {
    backgroundColor: "#121f3e",
  },
  amount: {
    fontSize: 38,
    color: "#121f3e",
  },
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NewNFC;
