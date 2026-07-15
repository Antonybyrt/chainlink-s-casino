import { ethers } from "ethers";
import { abi } from "../../../casino-contract/artifacts/contracts/BlackJack/BlackjackV1.sol/BlackjackV1.json";
import { config } from "dotenv";
config();

export const contractAddress: `0x${string}` = process.env.NEXT_PUBLIC_BLACKJACK as `0x${string}`;

export const RPC: string = process.env.NEXT_PUBLIC_ETHERLINK_RPC as string;

export const provider = new ethers.providers.JsonRpcProvider(RPC);
export const wallet = new ethers.Wallet(
  process.env.NEXT_PUBLIC_PRIVATE_KEY as string,
  provider
);

export const contract = new ethers.Contract(contractAddress, abi, wallet);
