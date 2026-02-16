# 🧠 AGENTS.md: The Ultimate Aleo Mastery Protocol (v6.0)

This document is the definitive technical protocol for any AI agent or engineer working with the Aleo blockchain. It codifies the architecture, language, interaction protocols, and security audits required to build world-class, privacy-preserving decentralized applications across Web, Mobile, and Node.js environments.

---

## 🌎 1. Aleo Blockchain Architecture & Ledger Model
Aleo is a Layer 1 blockchain using **Zero-Knowledge Proofs (ZKP)** for privacy and scalability.

- **snarkVM**: The execution engine and ledger implementing the **Varuna** proof system and the **Record model**.
- **Async/Finalize Separation**:
    - **Transitions**: Off-chain proof generation. They are private by default and modify records.
    - **Finalize**: On-chain state updates. They are public and update mappings.
- **Record Model (UTXO-like)**: Private data objects with an `owner`, `nonce`, and custom data. Every record can be spent exactly once.
- **snarkOS**: The P2P network protocol for consensus (AleoBFT) and state synchronization.

---

## ✍️ 2. Leo Language: Syntax & Mastering the AVM
### Primitive Types & Strict Literals
AI agents MUST use explicit type suffixes to avoid compilation errors.
- **Integers**: `1u8`, `1u16`, `1u32`, `1u64`, `1u128`, `1i8` (signed).
- **ZKP Primitives**: `1field` (prime field element), `1group` (elliptic curve point), `1scalar` (group exponent).
- **Boolean & Address**: `true`, `aleo1...`.

### Efficient Circuit Design (Constraint Management)
- **Rules for Efficiency**:
    - Avoid `if/else` inside transitions; use `ternary` or move logic to `finalize`.
    - Minimize large array operations; they are expensive in ZK.
    - Use `inline` functions to reduce function call overhead in the circuit.
    - **Constructor**: Use `@admin(address=...) async constructor() {}` for modern deployments.

---

## 🔒 3. Advanced Privacy Patterns
Universal Aleo dApps must implement these patterns to be technically "Aleo-Native":

- **The Nullifier Pattern**: Allows updating private state by "spending" a record and recording its unique hash (nullifier) in an on-chain mapping to prevent double-spending.
- **Stealth Addresses**: Derived one-time destination addresses ($P = H(r * A) * G + A$) that protect recipient identity.
- **Commit-Reveal**: Hashing a secret choice ($Hash(vote, salt)$) on-chain and revealing it later to prove knowledge without early disclosure.
- **View Keys**: Use the account's View Key to allow selective disclosure or auditing of private records without granting spending power.
- **Shielded Transfers**: Frequently sharding (splitting) and merging (joining) credit records to obfuscate transaction trails.

---

## 🚀 4. Environment Mastery: Web, Mobile & Node.js
### The 'Worker' Crash Fix (SharedArrayBuffer)
Modern browsers require **Cross-Origin Isolation** for the multithreaded WASM used in ZK-proving.
1.  **Solution (PWA/Web)**: Register `coi-serviceworker` to inject headers (`COOP: same-origin`, `COEP: require-corp`).
2.  **Solution (Mobile/Restricted)**: Use a **Remote Proving API**. Move compilation and synthesis to a Node.js backend (`@provablehq/sdk`) and return the unsigned transaction for the frontend to sign.

### Performance Tuning & Hardware Awareness
- **Warm-Starting**: Call `initThreadPool(1)` during idle time to reduce first-proof latency.
- **RAM Check**: Before high-thread initialization, check `navigator.deviceMemory`. If < 4GB, stick to 1-2 threads to prevent browser crashes.
- **Key Caching**: Cache `.prover` and `.verifier` files in `IndexedDB` or local storage to skip the synthesis step (saving 10-20s).

---

## 🔌 5. SDK & Wallet Integration
### Library: `@provablehq/sdk` & `@provablehq/aleo-wallet-adaptor-react`
- **ProgramManager**: The core for compiling, deploying, and executing.
- **Record Discovery**: Use `requestRecords(programId)` and decrypt them using the account's view key to compute private balances.
- **Wallet Nuances**:
    - **Leo Wallet**: Stable, supports bulk requests.
    - **Puzzle Wallet**: Often returns JSON-stringified records that require manual parsing.
    - **Fox Wallet**: Highly sensitive to WASM thread counts.

---

## 💸 6. Deployment & Scaling Strategy
### The "Namespace" Fee Trap
- **Rule**: Program names < 10 characters incur a premium fee (e.g., 10+ credits).
- **Skill**: Always expand program names to 10+ characters (e.g., `my_app_v1_xyz.aleo`) to ensure a 0-credit namespace fee.

### High-Volume Throughput (UTXO Management)
To execute 250+ transactions quickly:
- **Record Contention**: A single record can only be used once per block.
- **Fan-Out Strategy**: Split a large credit record into many small ones (e.g., 50 records of 1 credit each) to allow parallel transaction signing.
- **Join Strategy**: Periodically merge spent records to reduce wallet sync time.
- **Public Fees**: Use `fee_public` in the `credits.aleo` program to avoid UTXO locking on fee payment.

---

## 🛡️ 7. Security & Audit Protocol
1.  **Permission Check**: Every sensitive transition must check `assert_eq(self.caller, admin)`.
2.  **Record Ownership**: Ensure output records are sent to the intended `owner`.
3.  **No Hardcoding**: Never hardcode private keys. Use `process.env.ALEO_PRIVATE_KEY`.
4.  **Off-Chain Auth**: Use `signMessage` to verify identity for server-side sessions without a password.

---

## ⚙️ 8. CI/CD & Verification
- **Test-First**: Always run `leo test` before deployment.
- **Health Checks**: Implement periodic pings to Remote Proving endpoints to ensure availability.
- **AVM Tracing**: Debug by reading the generated `.aleo` bytecode for register-to-record casting (`cast r0 into r1 as RecordName.record`).

---
*This protocol serves as the definitive cognitive architecture for Aleo Engineering. Strictly adhere to these definitions to achieve flawless system integration.*
