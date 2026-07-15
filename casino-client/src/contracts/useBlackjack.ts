import { useState, useEffect, useRef } from "react";
import { useWaitForTransactionReceipt, useAccount, useReadContract, useWriteContract } from "wagmi";
import { ErrorService } from "@/service/error.service";
import {
    useWriteBlackjackNewGame,
    useWriteBlackjackRegister,
    useReadBlackjackPlayers,
    useWriteBlackjackHit,
    useWriteBlackjackDeposit,
    useWriteBlackjackDoubleBet,
    useWriteBlackjackStand,
    useWriteBlackjackSplit,
}
    from "./generatedContracts";
import { fetchCardDealtEvents, fetchDealerActionEvents, fetchGameResolvedEvents } from "@/lib/utils";
import { contract } from "@/config/ethers.config";
import { usePublicClient } from "wagmi";
import { ethers } from "ethers";

export const useBlackjack = () => {
    const { isConnected, connector, address } = useAccount();

    const { writeContractAsync: writeNewGame, data: newGameHash, isPending: isNewGamePending } = useWriteBlackjackNewGame();
    const { writeContractAsync: writeRegister, data: registerHash, isPending: isRegisterPending } = useWriteBlackjackRegister();
    const { writeContractAsync: writeHit, data: hitHash, isPending: isHitPending } = useWriteBlackjackHit();
    const { writeContractAsync: writeDeposit, data: depositHash, isPending: isDepositPending } = useWriteBlackjackDeposit();
    const { writeContractAsync: writeDouble, data: doubleHash, isPending: isDoublePending } = useWriteBlackjackDoubleBet();
    const { writeContractAsync: writeStand, data: standHash, isPending: isStandPending } = useWriteBlackjackStand();
    const { writeContractAsync: writeSplit, data: splitHash, isPending: isSplitPending } = useWriteBlackjackSplit();
    
    const { isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: newGameHash || registerHash || hitHash || depositHash || doubleHash || standHash || splitHash });
    const { data: playerData, refetch: refetchPlayerData } = useReadBlackjackPlayers({ 
        args: [address || '0x0000000000000000000000000000000000000000']
    });
    const publicClient = usePublicClient();

    const [playerCards, setPlayerCards] = useState<number[]>([]);
    const [dealerCards, setDealerCards] = useState<number[]>([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [casinoBalance, setCasinoBalance] = useState<number>(0);
    const [gameStarted, setGameStarted] = useState(false);
    const [currentBet, setCurrentBet] = useState<number | null>(null);
    const [gameId, setGameId] = useState<number | null>(null);
    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState<{outcome: "Win" | "Push" | "Lost" | "Split", winPercentage: number, totalPayout: number} | null>(null);
    const [splitCards, setSplitCards] = useState<number[]>([]);
    const [isSplit, setIsSplit] = useState(false);
    const [activeSplitHand, setActiveSplitHand] = useState(false);

    const processedTransactions = useRef(new Set<string>());

    useEffect(() => {
        const handleTransactionConfirmation = async (hash: string) => {
            if (processedTransactions.current.has(hash)) {
                ErrorService.mixinMessage(`Transaction already processed`, "info");
                return;
            }

            ErrorService.mixinMessage(`Transaction confirmed`, "success");
            if (!publicClient) {
                console.error("PublicClient is not available");
                return;
            }

            try {
                const receipt = await publicClient.waitForTransactionReceipt({ 
                    hash: hash as `0x${string}`,
                    timeout: 30_000
                });
                
                if (!receipt) {
                    throw new Error("No receipt received");
                }

                processedTransactions.current.add(hash);

                if (hash === registerHash) {
                    setPlayerCards([]);
                    setDealerCards([]);
                    if (address) {
                        setTimeout(async () => {
                            try {
                                await refetchPlayerData();
                            } catch (error) {
                                console.error("Error refreshing player data:", error);
                            }
                        }, 2000);
                    }
                    return;
                }

                if (hash === depositHash) {
                    if (address) {
                        setTimeout(async () => {
                            try {
                                await refetchPlayerData();
                            } catch (error) {
                                console.error("Error refreshing player data:", error);
                            }
                        }, 2000);
                    }
                    return;
                }

                const blockNumber = Number(receipt.blockNumber);

                if (hash === newGameHash) {
                    await fetchCardDealtEvents(
                        contract,
                        blockNumber,
                        setPlayerCards,
                        setDealerCards,
                        setGameId,
                        setGameStarted,
                        false,
                        setSplitCards
                    );
                    await fetchGameResolvedEvents(contract, blockNumber, setGameResult, setIsGameOver);
                } else if (hash === hitHash || hash === doubleHash) {
                    await fetchCardDealtEvents(
                        contract,
                        blockNumber,
                        setPlayerCards,
                        setDealerCards,
                        setGameId,
                        setGameStarted,
                        true,
                        setSplitCards
                    );
                    await fetchGameResolvedEvents(contract, blockNumber, setGameResult, setIsGameOver);
                } else if (hash === standHash) {
                    await fetchCardDealtEvents(
                        contract,
                        blockNumber,
                        setPlayerCards,
                        setDealerCards,
                        setGameId,
                        setGameStarted,
                        false,
                        setSplitCards
                    );
                    await fetchDealerActionEvents(contract, blockNumber, setIsGameOver);
                    await fetchGameResolvedEvents(contract, blockNumber, setGameResult, setIsGameOver);
                } else if (hash === splitHash) {
                    setIsSplit(true);
                    
                    setPlayerCards(prev => [prev[0]]);
                    setSplitCards(prev => [...prev, playerCards[1]]);
                    
                    await fetchCardDealtEvents(
                        contract,
                        blockNumber,
                        setPlayerCards,
                        setDealerCards,
                        setGameId,
                        setGameStarted,
                        true,
                        setSplitCards
                    );
                    await fetchGameResolvedEvents(contract, blockNumber, setGameResult, setIsGameOver);
                }
            } catch (error) {
                console.error("Error processing transaction:", error);
                if (error instanceof Error && error.message.includes("Timed out")) {
                    ErrorService.mixinMessage("Transaction is taking longer than expected. Please wait or refresh the page.", "warning");
                } else {
                    ErrorService.mixinMessage("Error processing transaction", "error");
                }
            }
        };

        if (newGameHash && !processedTransactions.current.has(newGameHash)) {
            handleTransactionConfirmation(newGameHash);
        }
        if (hitHash && !processedTransactions.current.has(hitHash)) {
            handleTransactionConfirmation(hitHash);
        }
        if (registerHash && !processedTransactions.current.has(registerHash)) {
            handleTransactionConfirmation(registerHash);
        }
        if (depositHash && !processedTransactions.current.has(depositHash)) {
            handleTransactionConfirmation(depositHash);
        }
        if (doubleHash && !processedTransactions.current.has(doubleHash)) {
            handleTransactionConfirmation(doubleHash);
        }
        if (standHash && !processedTransactions.current.has(standHash)) {
            handleTransactionConfirmation(standHash);
        }
        if (splitHash && !processedTransactions.current.has(splitHash)) {
            handleTransactionConfirmation(splitHash);
        }
    }, [newGameHash, hitHash, registerHash, depositHash, doubleHash, standHash, splitHash, contract, publicClient, address, refetchPlayerData]);

    useEffect(() => {
        if (playerData) {
            const [playerAddr, balance] = playerData;
            setIsRegistered(playerAddr !== '0x0000000000000000000000000000000000000000');
            if (balance !== undefined) {
                setCasinoBalance(Number(balance) / 10**18);
            } else {
                setCasinoBalance(0);
            }
        } else {
            setCasinoBalance(0);
        }
    }, [playerData]);

    const register = async (amount: number) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Registering...", "info");

        try {
            const amountInMutez = BigInt(amount * 10**18);
            await writeRegister({ value: amountInMutez });
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error while registering", "error");
                console.log(err);
            }
        }
    };

    const deposit = async (amount: number) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Sending funds...", "info");

        try {
            const amountInMutez = BigInt(amount * 10**18);
            await writeDeposit({ value: amountInMutez });
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error while sending funds", "error");
                console.log(err);
            }
        }
    }

    const newGame = async (bet: number) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Starting a new game...", "info");

        try {
            const betInMutez = BigInt(bet * 10**18);
            await writeNewGame({ args: [betInMutez] })
            setCurrentBet(bet);
            setGameResult(null);
            setIsGameOver(false);
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Erreur lors du démarrage d'une nouvelle partie", "error");
                console.log(err);
            }
        }
    };

    const hit = async (gameId: number, splitHand: boolean) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Hitting a new card...", "info");

        try {
            await writeHit({ args: [BigInt(gameId), splitHand] })
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error while hitting", "error");
                console.log(err);
            }

        }
    }

    const double = async (gameId: number) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Double and hitting a card...", "info");

        try {
            await writeDouble({ args: [BigInt(gameId)] })
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error during the double...", "error");
                console.log(err);
            }
        }
    }

    const stand = async (gameId: number) => {
        if (!isConnected) {
            await connector?.connect();
        }
        ErrorService.mixinMessage("Standing...", "info");

        try {
            await writeStand({ args: [BigInt(gameId)] })
        } catch(err: any) {
            if (err.message.includes("User rejected the request")) {
                ErrorService.mixinMessage("Transaction cancelled. Please try again.", "warning");
            } else {
                ErrorService.mixinMessage("Error during stand...", "error");
                console.log(err);
            }
        }
    }

    const split = async (gameId: number) => {
        if (!gameId) {
            throw new Error('No game in progress');
        }
        try {
            await writeSplit({ args: [BigInt(gameId)] });
            setIsSplit(true);
        } catch (error) {
            console.error('Error splitting:', error);
            throw error;
        }
    };

    const resetGame = () => {
        setPlayerCards([]);
        setDealerCards([]);
        setGameStarted(false);
        setCurrentBet(null);
        setGameId(null);
        setIsGameOver(false);
        setGameResult(null);
        setSplitCards([]);
        setIsSplit(false);
        refetchPlayerData();
    };

    return { 
        isPending: isNewGamePending || isRegisterPending || isHitPending || isDepositPending || isDoublePending || isStandPending || isSplitPending,
        newGame,
        deposit,
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
        isConfirmed,
        gameStarted,
        currentBet,
        resetGame,
        isGameOver,
        gameResult,
        splitCards,
        isSplit
    };
};