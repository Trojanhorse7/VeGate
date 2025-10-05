import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-verify";
import "@vechain/sdk-hardhat-plugin";
import { HDKey } from "@vechain/sdk-core";
import * as dotenv from "dotenv";

dotenv.config();

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      evmVersion: "paris", // VeChain compatibility
    },
  },
  networks: {
    // VeChain TestNet (Mnemonic-based - RECOMMENDED)
    vechain_testnet: {
      url: process.env.VECHAIN_TESTNET_URL || "https://testnet.vechain.org",
      accounts: process.env.VECHAIN_TESTNET_MNEMONIC 
        ? {
            mnemonic: process.env.VECHAIN_TESTNET_MNEMONIC,
            path: HDKey.VET_DERIVATION_PATH,
            count: 3,
            initialIndex: 0,
            passphrase: "vechainthor",
          }
        : process.env.PRIVATE_KEY 
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 39,
      // @ts-ignore - VeChain specific options
      delegator: undefined,
      gas: "auto",
      gasPrice: "auto",
    },
    // VeChain MainNet
    vechain_mainnet: {
      url: process.env.VECHAIN_MAINNET_URL || "https://mainnet.vechain.org",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 100009,
    },
  },
  etherscan: {
    apiKey: {
      vechain_testnet: "no-api-key-needed",
      vechain_mainnet: "no-api-key-needed",
    },
    customChains: [
      {
        network: "vechain_testnet",
        chainId: 39,
        urls: {
          apiURL: "https://explore-testnet.vechain.org/api",
          browserURL: "https://explore-testnet.vechain.org",
        },
      },
      {
        network: "vechain_mainnet",
        chainId: 100009,
        urls: {
          apiURL: "https://explore.vechain.org/api",
          browserURL: "https://explore.vechain.org",
        },
      },
    ],
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};

export default config;
