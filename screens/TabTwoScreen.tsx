import React, { useState } from 'react';
import { StyleSheet, TextInput, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';

import { ethers } from "ethers";
import { Text, View } from '../components/Themed';

import SupplyChain from "../abi/SupplyChain.json"
import { useWalletConnect } from '@walletconnect/react-native-dapp';
import WalletConnectProvider from '@walletconnect/web3-provider';
import CryptoES from "crypto-es";
import QRCode from 'react-native-qrcode-svg';

const shortenAddress = (address: string) => {
  return `${address.slice(0, 6)}...${address.slice(
    address.length - 4,
    address.length
  )}`;
}

export default function TabTwoScreen() {
  const connector = useWalletConnect();
  const [itemName, setItemName] = useState("")
  const [itemId, setItemId] = useState("")
  const [encryptedId, setEncryptedId] = useState("")
  const [success, setSuccess] = useState(false)

  const getProvider = async (connector: any): Promise<WalletConnectProvider> => {
    const provider = new WalletConnectProvider({
      infuraId: "4d580c025cee4ee182b65cf75c0ec47e",
      connector: connector,
      qrcode: false,
    })

    await provider.enable()

    return provider
  }

  const getSigner = (provider: WalletConnectProvider): ethers.providers.JsonRpcSigner => {
    const ethers_provider = new ethers.providers.Web3Provider(provider);
    const signer = ethers_provider.getSigner();
    return signer
  }

  const getContract = async (): Promise<ethers.Contract> => {
    const provider = await getProvider(connector)
    const contract = new ethers.Contract("0x0446da4FdfDb9843d69D12A0a935dbb98Edf4009", SupplyChain, getSigner(provider))
    return contract
  }

  const createItem = async (item_name: string, item_id: string) => {
    const contract = await getContract()
    const encrypted = CryptoES.AES.encrypt(item_name + " with id " + item_id, ".d$Piw1Z:v*7uS+TH").toString();
    setEncryptedId(encrypted)
    const transaction = contract.newItem(parseInt(item_id), item_name, encrypted.substring(0, 10), {
      gasLimit: 500000,
    })
    transaction
    .then((res: any) => {
      setSuccess(true)
      alert(`Transaction ${res.hash} was successful.`)
    })
    .catch((err: any) => console.log(err))
  }

  const connectWallet = React.useCallback(() => {
    return connector.connect();
  }, [connector]);

  const killSession = React.useCallback(() => {
    return connector.killSession();
  }, [connector]);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <View style={styles.container}>
          <>
            {!connector.connected && (
              <>
                <Text style={styles.title}>Get Started with Supply Chain</Text>
                <TouchableOpacity onPress={connectWallet} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Connect Wallet</Text>
                </TouchableOpacity>
              </>
            )}
            {connector.connected && (
              <>
                <Text style={styles.address}>Address: {shortenAddress(connector.accounts[0])}</Text>
                <Text style={styles.title}>Create Supply</Text>
                <TextInput value={itemId} style={styles.input} onChangeText={text => setItemId(text)} placeholder="Item id" placeholderTextColor="#a7a7a7" />
                <TextInput value={itemName} onChangeText={text => setItemName(text)} style={styles.input} placeholder="Item name" placeholderTextColor="#a7a7a7" />
                <TouchableOpacity onPress={() => createItem(itemName, itemId)} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>+ Add Item</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={killSession} style={styles.buttonStyle}>
                  <Text style={styles.buttonTextStyle}>Log out</Text>
                </TouchableOpacity>
                {success && (
                  <View style={styles.qrCode}>
                    <QRCode
                      value={encryptedId}
                      size={200}
                    />
                  </View>
                )}
              </>
            )}
          </>
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 50
  },
  address: {
    marginLeft: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 60,
    marginLeft: 40
  },
  input: {
    height: 40,
    margin: 12,
    marginLeft: 40,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: "#a7a7a7"
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
  qrCode: {
    marginLeft: 40,
    marginTop: 10
  }
});
