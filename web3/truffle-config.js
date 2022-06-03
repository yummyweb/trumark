const HDWalletProvider = require('@truffle/hdwallet-provider');

const MNEMONIC = "81ea28c510f9f0af6032837eb169f28b5a8510e46f5e3e38609114814e9429f2"

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*"
    },
    ropsten: {
      provider: function() {
        return new HDWalletProvider(MNEMONIC, "wss://ropsten.infura.io/ws/v3/4d580c025cee4ee182b65cf75c0ec47e")
      },
      network_id: 3,
      gas: 4000000      //make sure this gas allocation isn't over 4M, which is the max
    }
  },

  // Set default mocha options here, use special reporters, etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.14",      // Fetch exact version from solc-bin (default: truffle's version)
    }
  },
};
