require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
require("@nomicfoundation/hardhat-verify");

module.exports = {
  networks: {
    sepolia: {
      url: "https://sepolia.infura.io/v3/ad5fbc4fb2da44aaab1479926946491f",
      accounts: [
        "87536f8966281628e18236a0489cec3755e806aeedaffc986fb4fe4d226007e8",
      ],
    },
  },
  solidity: {
    version: "0.8.7",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  etherscan: {
    // Your API key for Etherscan
    // Obtain one at https://etherscan.io/
    apiKey: "I8XAYK1PZH8Z4KSDSH9RPQHJHYSK2YBTRG",
  },
  sourcify: {
    // Disabled by default
    // Doesn't need an API key
    enabled: true,
  },
  paths: {
    sources: "./src/contracts",
    artifacts: "./src/abis",
  },
  mocha: {
    timeout: 40000,
  },
};
//npx hardhat verify --network sepolia 0xaa017F1ee55374BBd1171975410C6c9953869E75 2
