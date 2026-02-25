import { useState, useCallback, useRef } from "react";

/**
 * Robust Aleo Wallet Hook
 *
 * Fixes:
 * 1. Double-submission via in-flight tracking.
 * 2. malformed field literals by ensuring proper suffixing.
 * 3. Connection state management.
 */
export function useAleoWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isExecuting, setIsExecuting] = useState(false);

  // In-flight transaction tracking to prevent double-submits
  const inFlightRef = useRef(false);

  const connect = useCallback(async () => {
    if (isConnecting) return;
    setIsConnecting(true);
    try {
      // Assuming Provable Wallet Extension is available at window.aleo
      const aleo = (window as any).aleo;
      if (!aleo) {
        throw new Error("Aleo wallet not found. Please install Provable Wallet.");
      }

      const publicKey = await aleo.connect("testnet", ["decrypt", "records"]);
      setAddress(publicKey);
    } catch (error: any) {
      console.error("Wallet connection failed:", error);
      throw error;
    } finally {
      setIsConnecting(false);
    }
  }, [isConnecting]);

  const disconnect = useCallback(async () => {
    const aleo = (window as any).aleo;
    if (aleo) {
      await aleo.disconnect();
    }
    setAddress(null);
  }, []);

  /**
   * Executes a transaction with robust formatting and duplicate prevention.
   */
  const requestTransaction = useCallback(async (programId: string, functionName: string, inputs: any[], fee: number) => {
    if (inFlightRef.current) {
      console.warn("Transaction already in flight. Blocking duplicate request.");
      throw new Error("Transaction in progress. Please wait.");
    }

    const aleo = (window as any).aleo;
    if (!aleo) throw new Error("Wallet not connected");

    setIsExecuting(true);
    inFlightRef.current = true;

    try {
      // Format inputs: Ensure field literals have the "field" suffix if they are hex
      const formattedInputs = inputs.map(input => {
        if (typeof input === "string" && /^[0-9a-fA-F]{64}$/.test(input)) {
          // It's a 64-char hex (likely a hash), convert to decimal field literal
          return BigInt("0x" + input).toString() + "field";
        }
        return input;
      });

      const txRequest = {
        programId,
        functionName,
        inputs: formattedInputs,
        fee: Math.floor(fee * 1_000_000).toString() + "u64", // Standard fee formatting (microcredits)
      };

      console.log("Requesting transaction:", txRequest);
      const txId = await aleo.requestTransaction(txRequest);
      return txId;
    } catch (error: any) {
      console.error("Transaction execution failed:", error);
      throw error;
    } finally {
      setIsExecuting(false);
      inFlightRef.current = false;
    }
  }, []);

  /**
   * Retrieves the status of a specific transaction from the wallet.
   * This is preferred over explorer polling for Shielded transactions.
   */
  const getTransactionStatus = useCallback(async (txId: string) => {
    const aleo = (window as any).aleo;
    if (!aleo) return "Wallet not found";

    try {
      // The Provable/Shield wallet provides transaction status directly
      const status = await aleo.transactionStatus(txId);
      return status; // e.g., "Pending", "Completed", "Failed"
    } catch (error) {
      console.error("Failed to get transaction status:", error);
      return "Error";
    }
  }, []);

  return {
    address,
    isConnecting,
    isExecuting,
    connect,
    disconnect,
    requestTransaction,
    getTransactionStatus
  };
}
