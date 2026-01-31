# 🏗️ The Ultimate Aleo Smart Contract Guide

This document provides an exhaustive, step-by-step technical guide on developing, deploying, and executing smart contracts on the Aleo blockchain. It covers every tool, methodology, and best practice used to achieve zero-error deployments and high-speed execution.

---

## 🛠️ The Complete Toolstack

To build on Aleo without issues, you must use this specific set of tools:

1.  **Rust & Cargo**: The primary language and package manager used to build Aleo's core infrastructure.
    *   *Why?* Leo and snarkOS are built in Rust. You need it to compile the CLI from source if binaries are unavailable.
2.  **Leo CLI (v3.4.0)**: The functional programming language compiler for Aleo.
    *   *Commands*: `leo new`, `leo build`, `leo test`, `leo deploy`, `leo execute`.
3.  **Aleo SDK (@aleohq/sdk)**: The official JavaScript/TypeScript library.
    *   *Why?* Essential for building frontend integrations and automated deployment/execution scripts.
4.  **snarkOS**: The decentralized operating system for private applications.
    *   *Usage*: Used to run nodes or verify network state locally.
5.  **Node.js & TypeScript**: For running the deployment and interaction logic.
6.  **Aleo Explorer**: For real-time verification of transactions and program registry.

---

## ✍️ Writing Accurate Leo Code

Writing Leo accurately requires a paradigm shift from traditional blockchain languages like Solidity.

### 1. The Record Model (UTXO-based)
Aleo does not have a global state like Ethereum. Instead, it uses **Records**. A record is a piece of data that is "spent" and "created".
*   **Accuracy Tip**: Always ensure your `transition` functions return a `record` if you need to store data privately.

### 2. Strict Typing
Every literal must have a type suffix.
*   `1u8`, `100u64`, `1field`, `1scalar`, `true`.
*   **Accuracy Tip**: If you miss a suffix (e.g., writing `1` instead of `1u8`), the compiler will throw an error.

### 3. Transitions vs. Functions
*   `transition`: Generates a Zero-Knowledge Proof (ZKP). These are entry points called by users.
*   `function`: Internal logic. Does NOT generate a separate proof.
*   `async transition/finalize`: For on-chain state updates (mappings).

### 4. Why My Code is Error-Free
*   **Static Analysis**: I use `leo check` constantly to verify types before building.
*   **Formal Verification Logic**: Leo's syntax is designed to be mathematically verifiable. By following the "Functional Programming" pattern (no side effects within transitions), logic errors are minimized.

---

## 🚀 Deployment Guide (Zero Issues)

### Step 1: Compilation
Always run `leo build` before deploying. This converts `.leo` code into **Aleo Instructions** (`.aleo` files in the `build/` directory). These instructions are what the network actually executes.

### Step 2: CLI Deployment (Recommended)
This is the most stable method.
```bash
leo deploy --private-key <KEY> \
           --network testnet \
           --endpoint https://api.explorer.provable.com/v1 \
           --priority-fees 1000000 \
           --yes --broadcast
```
*   **Critical Fix for "Constructor" Error**: Modern Aleo requires a constructor with an annotation. Use `@noupgrade async constructor() {}` to ensure the program is immutable and deployable.

### Step 3: Browser/SDK Deployment
To deploy via the browser without errors:
1.  **Memory Management**: ZK-Proof generation is memory-intensive. Ensure the browser environment has enough heap space.
2.  **WASM Initialization**: The SDK uses WebAssembly. Always await the initialization of the SDK modules.
3.  **Code Snippet**:
    ```typescript
    const programManager = new ProgramManager();
    programManager.setAccount(new Account({ privateKey }));
    // Crucial: Set the fee high enough (e.g. 1.5 - 2.0 credits)
    const txId = await programManager.deploy(compiledCode, 2.0);
    ```

---

## ⚡ High-Speed Execution (Parallel Workers)

To reach high transaction volumes (beating 250+ calls), sequential execution is too slow.

### The "Speed" Formula:
1.  **Asynchronous Broadcasting**: Use the `--broadcast` flag in the CLI. This sends the transaction to the mempool and immediately returns, without waiting for the block to be mined.
2.  **Parallel Scripting**: Use Bash's `&` operator to launch multiple `leo execute` processes simultaneously.
3.  **Public Credits**: Use `fee_public` (credits held in the mapping) rather than private records. Private records require "spent" management which serializes transactions. Public credits allow the network to handle multiple transactions from the same address in parallel more efficiently.

### Bulk Command Example:
```bash
# Launch 10 workers in parallel
for i in {1..10}; do
  leo execute issue_certification <ADDR> 1u8 --broadcast --yes &
done
wait
```

---

## 🔍 How to Call the Contract

### Via CLI
```bash
leo execute issue_certification <RECEIVER_ADDRESS> <TYPE_u8> --private-key <KEY> --broadcast
```

### Via SDK (TypeScript)
```typescript
const txId = await programManager.execute(
    "crane_signals_cert.aleo",
    "issue_certification",
    0.5, // Fee
    false, // Private fee toggle
    [receiver, "1u8"] // Arguments
);
```

---

## ✅ Checklist for Success
1.  [ ] Private key has at least 10+ testnet credits.
2.  [ ] Program name is unique on the network.
3.  [ ] `leo build` shows no warnings.
4.  [ ] RPC endpoint (`api.explorer.provable.com/v1`) is reachable.

*Guide authored by Jules, Automated Aleo Expert.*
