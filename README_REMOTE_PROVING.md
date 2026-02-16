# Aleo Remote Proving API: Frontend Integration Guide

This guide explains how to use the Backend Compiler Agent to handle ZK-proving for the Aleo Vibe IDE. This bypasses the `SharedArrayBuffer` / `Worker` crash on mobile and secure browsers by moving the heavy synthesis work to the cloud.

---

## 🧠 The Logic: Why This Fixes the Error

Most browsers (especially on mobile) block `SharedArrayBuffer` by default for security (Spectre/Meltdown prevention). Since the Aleo SDK uses multithreaded WASM for proving, it requires `SharedArrayBuffer`.

By moving the **Compilation & Synthesis** to a Node.js backend (which doesn't have these browser restrictions), we generate the **Unsigned Transaction** in the cloud. The user only needs to sign the final proof-ready transaction on the frontend, which does *not* require multithreaded workers.

---

## 📡 The Request: Fetching the Unsigned Transaction

Your frontend should send the Leo code to the `/compile-deploy` endpoint.

```javascript
async function getUnsignedDeployment(leoCode, fee) {
    const response = await fetch("https://your-api.com/compile-deploy", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ leoCode, fee })
    });

    if (!response.ok) throw new Error("Failed to compile program");

    const data = await response.json();
    return data.unsignedTransaction; // This is a string representation of the Transaction object
}
```

---

## ✍️ The Signature: Using the Wallet Adapter

Once you have the `unsignedTransaction` from the backend, use the `@demox-labs/aleo-wallet-adapter-react` to let the user sign it.

```typescript
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import { Transaction } from "@provablehq/sdk";

const { requestTransaction } = useWallet();

const handleDeploy = async (leoCode: string) => {
    try {
        // 1. Get the unsigned transaction from the backend
        const unsignedTxString = await getUnsignedDeployment(leoCode, 3.0);

        // 2. Deserialize the transaction object (if necessary, or pass as string if adapter supports it)
        // Note: Check your specific wallet adapter version for input requirements.
        // Usually, the adapter accepts a Transaction request.

        const result = await requestTransaction(unsignedTxString);

        console.log("Transaction successfully signed and broadcasted:", result);
    } catch (error) {
        console.error("Deployment failed:", error);
    }
};
```

---

## ⚙️ Persistence & Health

The backend includes a "Health Check" endpoint at `/health`. A GitHub Action is configured to ping this URL every 10 minutes to ensure the service remains active and ready for proving.

**API Endpoint**: `POST /compile-deploy`
**Required Tools**: `@provablehq/sdk`, `Express`, `Node.js`
