import React, { useEffect, useState } from 'react';
import { StyleSheet, Button } from 'react-native';

import Constants from 'expo-constants';
import * as Permissions from 'expo-permissions';
var C = require("crypto-js");

import {
  BarCodeScanner
} from 'expo-barcode-scanner';

import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';

import { useWalletConnect } from '@walletconnect/react-native-dapp';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export default function HomeScreen({ navigation }: RootTabScreenProps<'Home'>) {
  const connector = useWalletConnect();
  const [hasCameraPermission, setHasCameraPermission] = useState(false)
  const [scanned, setScanned] = useState(false)

  const getPermissionsAsync = async () => {
    const {
      status
    } = await Permissions.askAsync(Permissions.CAMERA);
    setHasCameraPermission(status === "granted")
  }

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true)
    const Decrypted = C.AES.decrypt(data, ".d$Piw1Z:v*7uS+TH");
    const result = Decrypted.toString(C.enc.Utf8)
    alert(result + " at Manufacturer")
  }

  useEffect(() => {
    getPermissionsAsync()
  }, [])

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan QR Code</Text>
      {!hasCameraPermission ? (
        <Text>Please allow app to access camera.</Text>
      ) : (
        <>
          <BarCodeScanner onBarCodeScanned={scanned ? undefined : handleBarCodeScanned} style={StyleSheet.absoluteFillObject} />
          {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  buttonStyle: {
    backgroundColor: "#343434",
    borderWidth: 0,
    color: "#FFFFFF",
    borderColor: "#3399FF",
    height: 40,
    alignItems: "center",
    borderRadius: 30,
    marginLeft: 35,
    marginRight: 35,
    marginTop: 20,
    marginBottom: 20,
  },
  buttonTextStyle: {
    color: "#FFFFFF",
    paddingVertical: 10,
    paddingHorizontal: 15,
    fontSize: 16,
    fontWeight: "600",
  },
});
