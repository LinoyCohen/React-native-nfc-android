import React from 'react';
import {View, StyleSheet, SafeAreaView, Platform} from 'react-native';
import {Button, TextInput, Chip} from 'react-native-paper';
import NfcManager, {Ndef, NfcTech} from 'react-native-nfc-manager';

function WriteNdefScreen(props) {
  const [selectedLinkType, setSelectedLinkType] = React.useState('WEB');
  const [value, setValue] = React.useState('');

  async function writeNdef() {
    let scheme = null;
    if (selectedLinkType === 'WEB') {
      scheme = 'https://';
    } else if (selectedLinkType === 'TEL') {
      scheme = 'tel:';
    } else if (selectedLinkType === 'TEXT') {
      scheme = '';
    } else if (selectedLinkType === 'EMAIL') {
      scheme = 'mailto:';
    } else {
      throw new Error('no such type');
    }
    const uriRecord = Ndef.uriRecord(`${value}`);
    const bytes = Ndef.encodeMessage([uriRecord]);
    console.warn(bytes);

    try {
      await NfcManager.requestTechnology(NfcTech.Ndef);
      await NfcManager.ndefHandler.writeNdefMessage(bytes);
    } catch (ex) {
      // bypass
    } finally {
      NfcManager.cancelTechnologyRequest();
    }
  }

  return (
    <View style={styles.wrapper}>
      <SafeAreaView />
      <View style={[styles.wrapper, styles.pad]}>

        <TextInput
          label="Enter the amount to transfer"
          value={value}
          onChangeText={setValue}
          autoCapitalize="sentences"
          style={styles.input}
        />
      </View>

      <View style={[styles.bottom, styles.bgLight]}>
        <Button onPress={writeNdef}>WRITE</Button>
      </View>
      <SafeAreaView style={styles.bgLight} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
  },
  pad: {
    padding: 20,
  },
  chip: {
    marginRight: 10,
    marginBottom: 10,
  },
  linkType: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  bottom: {
    padding: 10,
    alignItems: 'center',
    color: "#ccc"
  },
  bgLight: {
    backgroundColor: "#1a667a",
    color: "#ccc"
  },
  input: {
    backgroundColor: "white"
  }
});

export default WriteNdefScreen;