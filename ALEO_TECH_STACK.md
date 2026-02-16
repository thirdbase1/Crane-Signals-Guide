# 🛠️ Aleo Deep-Dive: Technical Stack & Modules

This document provides a low-level breakdown of the Aleo technical stack for advanced AI operations.

---

## 1. 🏗 Aleo Core Components (snarkOS & snarkVM)
- **snarkOS**: The peer-to-peer network protocol. It handles block gossip, consensus (AleoBFT), and state synchronization.
- **snarkVM**: The execution engine and ledger. It implements the **Varuna** proof system and the **Record model**.
- **BHP256 / BHP512**: Collision-resistant hash functions used for hashing records and mapping keys.
- **Poseidon**: A ZK-friendly hash function used extensively for efficiency in circuits.

---

## 2. 📦 The SDK Ecosystem
Interacting with Aleo requires navigating several rebranded and core libraries:

### `@provablehq/sdk`
This is the modern, unified SDK (rebranded from `@aleohq/sdk`).
- **`Account`**: Handles private keys, view keys, and addresses.
- **`ProgramManager`**: The orchestration layer for compiling, deploying, and executing programs.
- **`NetworkRecordProvider`**: Queries the network for the unspent records required for private transitions.
- **`initThreadPool`**: Manages the WebAssembly worker threads for parallelized ZK-proof generation.

### `@provablehq/aleo-wallet-adaptor-react`
The React bridge for browser-based dApps.
- **Components**: `AleoProvider`, `WalletProvider`, `WalletModalProvider`.
- **Hooks**: `useWallet()`, `useAccount()`.
- **Key Methods**:
    - `requestRecords(programId)`: Fetches private records from the connected wallet.
    - `requestTransaction(request)`: Triggers a signing and broadcast UI flow.
    - `requestExecution(request)`: Specifically for calling existing programs.
    - `requestDeploy(request)`: For deploying new Leo bytecode.

---

## 🔐 3. Private vs Public State
| Feature | Private (Records) | Public (Mappings) |
| :--- | :--- | :--- |
| **Visibility** | Only owner (or view-key holder) | Everyone |
| **Integrity** | Proven via ZKP | Verified by all consensus nodes |
| **Latency** | Local synthesis + Network broadcast | Async execution + Block confirmation |
| **Usage** | Private balances, identity, secret votes | Global registries, total supply, status |

---

## 📈 4. Advanced Performance Optimization
For high-volume AI "Vibe Coding":
- **Public Fees**: Using `fee_public` in the `credits.aleo` program allows for multiple concurrent transactions because public mapping updates don't require specific record UTXOs to be available.
- **Proving Keys**: Caching proving keys (`.prover` files) avoids the heavy synthesis step on every execution, reducing CPU/Memory load by ~70%.
- **Parallel Workers**: Setting `initThreadPool(os.cpus().length)` maximizes proving speed on multi-core systems.

---
*Maintained by Jules, Aleo Systems Engineering Agent.*
