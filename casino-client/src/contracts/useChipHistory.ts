import { useQuery } from "@tanstack/react-query";
import { useConnection } from "wagmi";
import { formatUnits } from "viem";

// Subsquid GraphQL server (sqd/): indexes the CHIP ERC20 Transfer events on Sepolia
const INDEXER_URL = process.env.NEXT_PUBLIC_INDEXER_URL ?? "http://localhost:4350/graphql";
const CHIP_DECIMALS = 18;

const TRANSFERS_QUERY = `
  query ChipTransfers($addr: String!) {
    transfers(
      where: { OR: [{ from_eq: $addr }, { to_eq: $addr }] }
      orderBy: blockNumber_ASC
      limit: 1000
    ) {
      from
      to
      value
      timestamp
    }
  }
`;

interface IndexedTransfer {
  from: string;
  to: string;
  value: string; // BigInt serialized as string by the GraphQL server
  timestamp: string;
}

export interface BalancePoint {
  time: number; // unix ms
  balance: number; // CHIP (formatted)
}

/**
 * Balance history of the connected wallet, rebuilt from the indexed CHIP
 * Transfer events: cumulative sum of everything received minus everything
 * sent (mints from buyChips arrive from 0x0, burns from cashOut go to 0x0,
 * bets go to the game contract and payouts come back from it).
 */
export const useChipHistory = () => {
  const { address } = useConnection();

  return useQuery({
    queryKey: ["chip-history", address],
    enabled: !!address,
    refetchInterval: 15_000,
    queryFn: async (): Promise<BalancePoint[]> => {
      const addr = address!.toLowerCase();
      const res = await fetch(INDEXER_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: TRANSFERS_QUERY, variables: { addr } }),
      });
      if (!res.ok) throw new Error(`Indexer HTTP ${res.status}`);
      const { data, errors } = await res.json();
      if (errors?.length) throw new Error(errors[0].message);

      let balance = BigInt(0);
      const points: BalancePoint[] = [];
      for (const t of data.transfers as IndexedTransfer[]) {
        if (t.to === addr) balance += BigInt(t.value);
        if (t.from === addr) balance -= BigInt(t.value);
        points.push({
          time: new Date(t.timestamp).getTime(),
          balance: Number(formatUnits(balance, CHIP_DECIMALS)),
        });
      }
      return points;
    },
  });
};
