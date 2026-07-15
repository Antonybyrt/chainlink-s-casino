import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@openzeppelin/hardhat-upgrades";
import * as dotenv from "dotenv";
dotenv.config();

const config: HardhatUserConfig = {
  solidity: "0.8.22",
  networks: {
    etherlink: {
      url: process.env.ETHERLINK_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
    },
    sepoliaEth: {
      url: process.env.SEPOLIA_ETH_URL || "",
      accounts: process.env.PRIVATE_KEY_SEPOLIA ? [process.env.PRIVATE_KEY_SEPOLIA] : [],
    },
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY
  }
};

export default config; 