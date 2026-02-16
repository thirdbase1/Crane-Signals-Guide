# 🧠 AGENTS.md: The Ultimate Aleo Mastery Protocol (v7.0 - Infinite Mastery Edition)

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
AI agents MUST use explicit type suffixes to avoid compilation errors.
- **Integers**: `1u8`, `1u16`, `1u32`, `1u64`, `1u128`, `1i8`.
- **ZKP Primitives**: `1field`, `1group`, `1scalar`.
- **Constructor**: Use `@admin(address=...) async constructor() {}`.

---

## 🔒 3. Advanced Privacy Patterns
- **The Nullifier Pattern**: Preventing double-spending in private state by recording record nullifiers in an on-chain mapping.
- **Stealth Addresses**: Derived one-time destination addresses for recipient privacy.
- **Commit-Reveal**: Secure bidding or voting via $Hash(vote, salt)$.
- **View Keys**: Selective disclosure of private records without spending authority.

---

## 🚀 4. Environment Mastery: Web, Mobile & Node.js
- **SharedArrayBuffer Fix**: Register `coi-serviceworker` for isolation headers.
- **Remote Proving**: Move synthesis to Node.js backend to bypass browser restrictions.
- **Hardware Awareness**: Check `navigator.deviceMemory` before high-thread `initThreadPool`.

---

## 🔌 5. SDK & Wallet Integration
- **ProgramManager**: Core orchestration for Aleo interactions.
- **Wallet Nuances**: Handle `PuzzleWallet` JSON-stringified records and `LeoWallet` bulk requests.

---

## 💸 6. Deployment & Scaling Strategy
- **Namespace Fee**: Program names < 10 characters incur premium fees. Always use 10+ characters.
- **UTXO Management**: Fan-out large credit records into many small ones to enable parallel transactions.

---

## 🛡️ 7. Security & Audit Protocol
- **Permission Check**: `assert_eq(self.caller, admin)`.
- **Off-Chain Auth**: `signMessage` for session management.

---

## ⚙️ 8. CI/CD & Verification
- **Test-First**: Run `leo test` before any deployment.
- **AVM Tracing**: Debug via register-to-record casting in `.aleo` files.

---

## 💎 9. Token Standards: ARC-20 (The Private Token Standard)
Aleo's token standard focuses on both private and public balances.
- **Private Balance**: Stored as `Token` records. Transferred via ZK-proofs.
- **Public Balance**: Stored in a `mapping(address => u64)`. Transferred via on-chain updates.
- **Protocol**: Implement `transfer_private`, `transfer_public`, `join`, and `split`.

---

## 🖼️ 10. NFT Standards: ARC-721
Non-fungible tokens on Aleo use BHP hashing for uniqueness.
- **Record Pattern**: Each NFT is a unique record with a `data` field (e.g., IPFS hash).
- **Metadata**: Can be stored publicly in a mapping for easier discovery or privately in records for ultimate exclusivity.

---

## 🔮 11. Oracles in Aleo: Pull vs. Push Models
- **Push Model**: An authorized address periodically updates an on-chain mapping with external data (e.g., price feeds).
- **Pull Model (ZK-Oracles)**: Users provide a ZK-proof of off-chain data (signed by a trusted source) directly into a transition.
- **Verification**: Always check the oracle's signature using `BHP256::hash_to_field` and ECDSA verification patterns.

---

## 🗳️ 12. DAO Governance: On-Chain Voting & Proposals
- **Proposal Lifecycle**: Create -> Vote -> Tally -> Execute.
- **Privacy**: Use encrypted votes (`VoteRecord`) that only the DAO admin can decrypt during the tally phase, or use the **Commit-Reveal** pattern.
- **Quorum**: Assert minimum participation in the `finalize` block.

---

## 🏢 13. Multi-Signature Wallets
- **Threshold Signatures**: Use a `mapping` to store approvals for a transaction ID.
- **Execution**: A transaction only executes once `approvals[tx_id] >= threshold`.
- **Pattern**: Transition 1: `submit_tx`; Transition 2: `approve_tx`; Transition 3: `execute_tx`.

---

## 🏗️ 14. Program Upgradability Patterns
Aleo programs are immutable by default.
- **Proxy Pattern**: A "Proxy" program stores the address of the "Logic" program in a mapping. All calls go through the proxy.
- **Migration**: To upgrade, the admin updates the mapping to point to the new logic program address.

---

## ⚡ 15. Gas & Priority Fee Strategies
- **Base Fee**: Calculated based on circuit constraints.
- **Priority Fees**: Essential for inclusion during network congestion.
- **Optimization**: Use `fee_public` to avoid record contention on fee payment.

---

## 🧪 16. Formal Verification for Leo
- **Static Analysis**: Use `leo check` to identify type mismatches.
- **Assertions**: Heavily use `assert`, `assert_eq`, and `assert_neq` to enforce state invariants.
- **Verification**: ZK-proofs themselves provide a mathematical guarantee that the transition was executed correctly according to the program logic.

---

## 🔗 17. Cross-Chain Bridges & Messaging
- **Lock-and-Mint**: Lock assets on Ethereum, provide a ZK-proof of the lock to Aleo to mint a wrapped token.
- **Burn-and-Unlock**: Burn on Aleo, use the burn transaction proof to unlock on the target chain.

---

## 🆔 18. Zero-Knowledge Identity (zkKYC)
- **Attribute Proofs**: Prove you are over 18 or from a specific country without revealing your birthdate or passport number.
- **Issuer Pattern**: A trusted issuer signs a `Identity` record. The user proves possession of this signed record in their transition.

---

## 🎲 19. Secure Randomness on Aleo
- **Deterministic Randomness**: Use `BHP256::hash_to_field(seed)` where seed is a combination of block height and private entropy.
- **VDFs (Verifiable Delay Functions)**: For high-security randomness, use an off-chain VDF and verify the proof on-chain.

---

## 📦 20. Package Management & Dependencies
- **Leo Dependencies**: Defined in `program.json`.
- **Network Imports**: `import credits.aleo;` allows interacting with system-level credits.
- **Versioning**: Always specify exact versions to prevent breaking changes in the Varuna proof system.

---

## 🐛 21. Debugging with snarkOS-explorer
- **Tx Inspection**: Analyze input/output records in the explorer to find where logic failed.
- **State Proofs**: Use the API to fetch state proofs for debugging `finalize` failures.

---

## 🏎️ 22. High-Throughput Parallel Execution
- **Multi-Worker**: Use `script/worker-bulk.sh` to spin up parallel processes.
- **Mempool Saturation**: Send transactions with the `--broadcast` flag to fill the mempool without waiting for confirmation.

---
*This protocol serves as the definitive cognitive architecture for Aleo Engineering. Strictly adhere to these definitions to achieve flawless system integration.*
