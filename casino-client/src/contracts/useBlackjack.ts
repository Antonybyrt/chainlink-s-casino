import { useState, useRef } from "react";
import {
    formatUnits,
    parseEther,
    parseUnits,
    decodeEventLog,
    maxUint256,
    zeroAddress,
    type Log,
} from "viem";
import { useConnection } from "wagmi";
import { waitForTransactionReceipt } from "@wagmi/core";
import {
    blackjackAbi,
    useReadBlackjackPlayers,
    useWriteBlackjackNewGame,
    useWriteBlackjackRegister,
    useWriteBlackjackBuyChips,
    useWriteBlackjackHit,
    useWriteBlackjackDoubleBet,
    useWriteBlackjackStand,
    useWriteBlackjackSplit,
    useWriteBlackjackCashOut,
    useReadCasinoChipBalanceOf,
    useReadCasinoChipAllowance,
    useWriteCasinoChipApprove,
    useWatchBlackjackCardDealtEvent,
    useWatchBlackjackGameResolvedEvent,
} from "./generatedContracts";
import { config } from "@/lib/client";
import { ErrorService } from "@/service/error.service";

const BLACKJACK_ADDRESS = process.env.NEXT_PUBLIC_BLACKJACK as `0x${string}`;
const CHIP_DECIMALS = 18;
const OUTCOMES = ["Lost", "Push", "Win", "Split"] as const;

/**
 * Game hook for the async (Chainlink VRF) + ERC20-CHIP Blackjack contract.
 *
 * Money: bets are escrowed in CHIP (ERC20) via `newGame` -> `transferFrom`, so the
 * player must `approve` the game contract once. The playable balance is the wallet's
 * CHIP balance (`balanceOf`), not an internal ETH bankroll.
 *
 * Cards: `newGame` is asynchronous — it only requests randomness and emits
 * `RandomnessRequested(gameId, …)`. The initial hand (`CardDealt` events) and any
 * resolution (`GameResolved`) arrive in a later VRF-fulfillment transaction. We read
 * them with wagmi event watchers keyed on the current `gameId`, which also covers the
 * synchronous draws from `hit`/`stand`/`double`/`split`.
 */
export const useBlackjack = () => {
    const { address } = useConnection();

    // ----- reads -----
    const { data: chipBalance, refetch: refetchChip } = useReadCasinoChipBalanceOf({
        args: [address ?? zeroAddress],
        query: { enabled: !!address, refetchInterval: 8000 },
    });
    const { data: allowance, refetch: refetchAllowance } = useReadCasinoChipAllowance({
        args: [address ?? zeroAddress, BLACKJACK_ADDRESS],
        query: { enabled: !!address },
    });
    const { data: playerData, refetch: refetchPlayer } = useReadBlackjackPlayers({
        args: [address ?? zeroAddress],
        query: { enabled: !!address },
    });

    // ----- writes -----
    const { mutateAsync: writeRegister, isPending: isRegisterPending } = useWriteBlackjackRegister();
    const { mutateAsync: writeBuyChips, isPending: isBuyPending } = useWriteBlackjackBuyChips();
    const { mutateAsync: writeApprove } = useWriteCasinoChipApprove();
    const { mutateAsync: writeNewGame, isPending: isNewGamePending } = useWriteBlackjackNewGame();
    const { mutateAsync: writeHit, isPending: isHitPending } = useWriteBlackjackHit();
    const { mutateAsync: writeDouble, isPending: isDoublePending } = useWriteBlackjackDoubleBet();
    const { mutateAsync: writeStand, isPending: isStandPending } = useWriteBlackjackStand();
    const { mutateAsync: writeSplit, isPending: isSplitPending } = useWriteBlackjackSplit();
    const { mutateAsync: writeCashOut, isPending: isCashOutPending } = useWriteBlackjackCashOut();

    // ----- game state -----
    const [gameId, setGameId] = useState<number | null>(null);
    const [playerCards, setPlayerCards] = useState<number[]>([]);
    const [dealerCards, setDealerCards] = useState<number[]>([]);
    const [splitCards, setSplitCards] = useState<number[]>([]);
    const [isSplit, setIsSplit] = useState(false);
    const [isWaitingForCards, setIsWaitingForCards] = useState(false);
    const [gameStarted, setGameStarted] = useState(false);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState<{
        outcome: "Win" | "Push" | "Lost" | "Split";
        winPercentage: number;
        totalPayout: number;
    } | null>(null);
    const [currentBet, setCurrentBet] = useState<number | null>(null);

    const processedLogs = useRef<Set<string>>(new Set());

    // ----- derived -----
    const isRegistered = !!playerData && (playerData as readonly unknown[])[0] !== zeroAddress;
    const casinoBalance = chipBalance ? Number(formatUnits(chipBalance as bigint, CHIP_DECIMALS)) : 0;

    // ----- shared log appliers (used by both the watcher and tx receipts) -----
    const applyCardDealt = (
        txHash: string,
        logIndex: number,
        receiver: string | undefined,
        card: number,
        splitHand: boolean,
    ) => {
        const key = `card:${txHash}:${logIndex}`;
        if (processedLogs.current.has(key)) return;
        processedLogs.current.add(key);
        if (receiver === zeroAddress) {
            setDealerCards((prev) => [...prev, card]);
        } else if (splitHand) {
            setSplitCards((prev) => [...prev, card]);
        } else {
            setPlayerCards((prev) => [...prev, card]);
        }
        setIsWaitingForCards(false);
        setGameStarted(true);
    };

    const applyResolved = (
        txHash: string,
        logIndex: number,
        outcomeIdx: number,
        winPercentage: number,
        payoutWei: bigint,
    ) => {
        const key = `res:${txHash}:${logIndex}`;
        if (processedLogs.current.has(key)) return;
        processedLogs.current.add(key);
        setGameResult({
            outcome: OUTCOMES[outcomeIdx],
            winPercentage,
            totalPayout: Number(formatUnits(payoutWei, CHIP_DECIMALS)),
        });
        setIsGameOver(true);
        setIsWaitingForCards(false);
        refetchChip();
    };

    // Synchronous actions (hit/stand/double/split) resolve in their own tx: decode
    // that receipt's logs directly instead of relying on the polling watcher.
    const applyReceiptLogs = (logs: readonly Log[]) => {
        for (const log of logs) {
            let decoded;
            try {
                decoded = decodeEventLog({ abi: blackjackAbi, data: log.data, topics: log.topics });
            } catch {
                continue; // not one of our events
            }
            const txHash = log.transactionHash ?? "";
            const logIndex = log.logIndex ?? 0;
            if (decoded.eventName === "CardDealt") {
                const a = decoded.args as { receiver: string; card: number | bigint; splitHand: boolean };
                applyCardDealt(txHash, logIndex, a.receiver, Number(a.card), Boolean(a.splitHand));
            } else if (decoded.eventName === "GameResolved") {
                const a = decoded.args as { outcome: number; winPercentage: bigint; totalPayout: bigint };
                applyResolved(txHash, logIndex, Number(a.outcome), Number(a.winPercentage), a.totalPayout);
            }
        }
    };

    // ----- event watcher: catches the async VRF initial deal -----
    useWatchBlackjackCardDealtEvent({
        args: gameId != null ? { gameId: BigInt(gameId) } : undefined,
        enabled: gameId != null,
        onLogs(logs) {
            for (const log of logs) {
                applyCardDealt(
                    (log.transactionHash as string) ?? "",
                    (log.logIndex as number) ?? 0,
                    log.args.receiver as string | undefined,
                    Number(log.args.card),
                    Boolean(log.args.splitHand),
                );
            }
        },
    });

    useWatchBlackjackGameResolvedEvent({
        args: gameId != null ? { gameId: BigInt(gameId) } : undefined,
        enabled: gameId != null,
        onLogs(logs) {
            for (const log of logs) {
                applyResolved(
                    (log.transactionHash as string) ?? "",
                    (log.logIndex as number) ?? 0,
                    Number(log.args.outcome),
                    Number(log.args.winPercentage),
                    log.args.totalPayout as bigint,
                );
            }
        },
    });

    // ----- helpers -----
    const resetLocalHands = () => {
        setPlayerCards([]);
        setDealerCards([]);
        setSplitCards([]);
        setIsSplit(false);
        setIsGameOver(false);
        setGameResult(null);
        processedLogs.current = new Set();
    };

    const ensureApproval = async (needed: bigint) => {
        const current = (allowance as bigint | undefined) ?? BigInt(0);
        if (current >= needed) return;
        const approveHash = await writeApprove({ args: [BLACKJACK_ADDRESS, maxUint256] });
        await waitForTransactionReceipt(config, { hash: approveHash });
        await refetchAllowance();
    };

    // ----- actions -----

    /** Register the player; any ETH sent is converted to CHIP (minted to the wallet). */
    const register = async (ethAmount: number) => {
        try {
            const hash = await writeRegister({ value: parseEther(String(ethAmount)) });
            await waitForTransactionReceipt(config, { hash });
            await Promise.all([refetchPlayer(), refetchChip()]);
        } catch (err: any) {
            if (err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error while registering", "error");
                console.error(err);
            }
        }
    };

    /** Buy more CHIP with ETH (ETH -> USD via price feed -> CHIP minted to the wallet). */
    const buyChips = async (ethAmount: number) => {
        try {
            const hash = await writeBuyChips({ value: parseEther(String(ethAmount)) });
            await waitForTransactionReceipt(config, { hash });
            await refetchChip();
        } catch (err: any) {
            if (err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error while buying chips", "error");
                console.error(err);
            }
        }
    };

    // kept name for API compatibility; buying chips == depositing ETH
    const deposit = buyChips;

    /** Redeem CHIP back to ETH at the current price. */
    const cashOut = async (chipAmount: number) => {
        try {
            const hash = await writeCashOut({ args: [parseUnits(String(chipAmount), CHIP_DECIMALS)] });
            await waitForTransactionReceipt(config, { hash });
            await refetchChip();
            ErrorService.mixinMessage("Chips cashed out", "success");
        } catch (err: any) {
            ErrorService.mixinMessage("Error while cashing out", "error");
            console.error(err);
        }
    };

    /** Start a game: approve if needed, escrow the bet, request VRF randomness. */
    const newGame = async (bet: number) => {
        if (!address) return;
        const betWei = parseUnits(String(bet), CHIP_DECIMALS);
        try {
            await ensureApproval(betWei);

            resetLocalHands();
            setCurrentBet(bet);

            const hash = await writeNewGame({ args: [betWei] });
            const receipt = await waitForTransactionReceipt(config, { hash });

            // Decode the gameId from the RandomnessRequested event, then wait for VRF.
            let gid: bigint | null = null;
            for (const log of receipt.logs) {
                try {
                    const decoded = decodeEventLog({
                        abi: blackjackAbi,
                        data: log.data,
                        topics: log.topics,
                    });
                    if (decoded.eventName === "RandomnessRequested") {
                        gid = (decoded.args as { gameId: bigint }).gameId;
                        break;
                    }
                } catch {
                    /* not one of our events */
                }
            }
            if (gid != null) {
                processedLogs.current = new Set();
                setGameId(Number(gid));
                setIsWaitingForCards(true);
            }
            await refetchChip();
        } catch (err: any) {
            setIsWaitingForCards(false);
            if (err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error starting a new game", "error");
                console.error(err);
            }
        }
    };

    const hit = async (id: number, splitHand: boolean) => {
        try {
            const hash = await writeHit({ args: [BigInt(id), splitHand] });
            const receipt = await waitForTransactionReceipt(config, { hash });
            applyReceiptLogs(receipt.logs);
        } catch (err: any) {
            if (!err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Error while hitting", "error");
            }
            console.error(err);
        }
    };

    const double = async (id: number) => {
        try {
            // double escrows an extra bet; MaxUint256 approval from newGame already covers it
            const hash = await writeDouble({ args: [BigInt(id)] });
            const receipt = await waitForTransactionReceipt(config, { hash });
            applyReceiptLogs(receipt.logs);
            await refetchChip();
        } catch (err: any) {
            if (!err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Error during the double", "error");
            }
            console.error(err);
        }
    };

    const stand = async (id: number) => {
        try {
            const hash = await writeStand({ args: [BigInt(id)] });
            const receipt = await waitForTransactionReceipt(config, { hash });
            applyReceiptLogs(receipt.logs);
        } catch (err: any) {
            if (!err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Error during stand", "error");
            }
            console.error(err);
        }
    };

    const split = async (id: number) => {
        if (!id) throw new Error("No game in progress");
        try {
            // The contract keeps the first card in the main hand and moves the second
            // card to the split hand without re-emitting it, so mirror that locally.
            const secondCard = playerCards[1];
            setIsSplit(true);
            setPlayerCards((prev) => prev.slice(0, 1));
            setSplitCards(secondCard !== undefined ? [secondCard] : []);
            const hash = await writeSplit({ args: [BigInt(id)] });
            const receipt = await waitForTransactionReceipt(config, { hash });
            applyReceiptLogs(receipt.logs);
            await refetchChip();
        } catch (err: any) {
            if (!err?.message?.includes("User rejected")) {
                ErrorService.mixinMessage("Error while splitting", "error");
            }
            console.error(err);
        }
    };

    const resetGame = () => {
        resetLocalHands();
        setGameStarted(false);
        setCurrentBet(null);
        setGameId(null);
        setIsWaitingForCards(false);
        refetchChip();
        refetchPlayer();
    };

    const isPending =
        isRegisterPending ||
        isBuyPending ||
        isNewGamePending ||
        isHitPending ||
        isDoublePending ||
        isStandPending ||
        isSplitPending ||
        isCashOutPending;

    return {
        isPending,
        isWaitingForCards,
        newGame,
        deposit,
        buyChips,
        cashOut,
        register,
        hit,
        double,
        stand,
        split,
        gameId,
        playerCards,
        dealerCards,
        isRegistered,
        casinoBalance,
        gameStarted,
        currentBet,
        resetGame,
        isGameOver,
        gameResult,
        splitCards,
        isSplit,
    };
};
