# 🧠 AGENTS.md: The Ultimate Aleo Mastery Protocol (v9.0 - Granular Mastery Edition)

This document is the absolute technical "brain" for any AI agent or senior engineer working with the Aleo blockchain. It provides a piece-by-piece breakdown of 74 specialized technical areas, explaining the **Definition**, **Leo/SDK Implementation**, **AI Interpretation Logic**, and **Critical Pitfalls**.

---

## 🌎 SECTION I: Core Blockchain Architecture

### 1. Aleo Layer 1 Ledger
- **Definition**: A decentralized ledger that uses Zero-Knowledge Proofs (ZKP) to decouple computation from verification.
- **Implementation**: Computation happens off-chain (locally); only the proof is verified on-chain.
- **AI Logic**: When designing dApps, always assume user data is private by default.
- **Pitfalls**: Don't treat Aleo like Ethereum; there is no shared "world state" that transitions can read directly.

### 2. snarkVM Execution Engine
- **Definition**: The virtual machine that executes Aleo instructions and generates Varuna proofs.
- **Implementation**: Compiled `.aleo` files are executed by snarkVM.
- **AI Logic**: Optimize code to reduce "gates" (constraints) to speed up user proof generation.
- **Pitfalls**: High register counts in AVM instructions lead to memory-intensive proving.

### 3. Record Model (Private State)
- **Definition**: A UTXO-based model where state is stored in encrypted "Records".
- **Implementation**: `record Note { owner: address, amount: u64 }`.
- **AI Logic**: Treat records as consumable objects. To "update" a value, spend the old record and output a new one.
- **Pitfalls**: A record can only be spent once. Concurrent transactions using the same record will fail.

### 4. Async/Finalize Separation
- **Definition**: The separation between private proof generation (Transition) and public state commitment (Finalize).
- **Implementation**: `async transition ... return finalize_call();`.
- **AI Logic**: Transitions create proofs; Finalize updates mappings (public state).
- **Pitfalls**: You cannot access `mappings` inside a transition. You must pass needed values as inputs.

---

## ✍️ SECTION II: Leo Language Mastery

### 5. Strict Typing & Suffixes
- **Definition**: Leo requires explicit types for every literal.
- **Implementation**: `let x: u64 = 100u64;`, `let b: bool = true;`.
- **AI Logic**: Never generate code without suffixes. The compiler will reject `let x = 100;`.
- **Pitfalls**: Mixing `u32` and `u64` in math operations without casting.

### 6. Inline Functions
- **Definition**: Functions that are expanded at the call site to reduce circuit depth.
- **Implementation**: `inline function calc(a: u64) -> u64 { ... }`.
- **AI Logic**: Use for reusable logic that doesn't need its own proof scope.
- **Pitfalls**: Too many inlines can explode the circuit size if the logic is massive.

### 7. Structs & Mappings
- **Definition**: Custom data types and public key-value stores.
- **Implementation**: `struct Info { id: u64 }`, `mapping counts: address => u32`.
- **AI Logic**: Use structs for grouped data; use mappings for global, public status tracking.
- **Pitfalls**: Mappings can only be updated in `finalize` blocks.

---

## 🔒 SECTION III: Privacy & Cryptography

### 8. The Nullifier Pattern
- **Definition**: Preventing double-spending of private records without revealing the record.
- **Implementation**: Store the hash of a record's unique ID in a public mapping.
- **AI Logic**: Check if `Mapping::contains(nullifiers, record_hash)` before proceeding.
- **Pitfalls**: Not using a unique salt in the hash, making it vulnerable to dictionary attacks.

### 9. Stealth Addresses
- **Definition**: One-time destination addresses derived from a recipient's public key.
- **Implementation**: $P = H(r * A) * G + A$ (Elliptic curve arithmetic).
- **AI Logic**: Generate a random scalar `r` for every transaction to ensure recipient privacy.
- **Pitfalls**: Recipient needs a View Key to "discover" funds sent to stealth addresses.

### 10. Commit-Reveal
- **Definition**: Submitting a hash (commitment) and revealing the data later.
- **Implementation**: Phase 1: `mapping[user] = hash(vote)`. Phase 2: `reveal(vote)`.
- **AI Logic**: Essential for fair voting/bidding to prevent front-running.
- **Pitfalls**: Not adding a random `nonce` to the hash, allowing others to brute-force the vote.

### 11. View Keys
- **Definition**: Decryption-only keys that do not allow spending.
- **Implementation**: Used in the SDK to decrypt records: `viewKey.decrypt(ciphertext)`.
- **AI Logic**: Use for auditing or showing users their private history in a frontend.
- **Pitfalls**: Storing View Keys in plaintext on a server; they should stay client-side.

---

## 🚀 SECTION IV: Environment & Scaling

### 12. SharedArrayBuffer Fix
- **Definition**: Enabling multithreading in browsers via COOP/COEP headers.
- **Implementation**: Register `coi-serviceworker` in the app entry point.
- **AI Logic**: Required for the Aleo Prover to work on mobile browsers.
- **Pitfalls**: Without this, `initThreadPool` will crash the browser worker.

### 13. Remote Proving API
- **Definition**: Offloading ZK-synthesis to a backend.
- **Implementation**: `POST /prove { code, inputs }` -> Returns unsigned transaction.
- **AI Logic**: Use as a fallback for low-RAM mobile devices or restricted environments.
- **Pitfalls**: Do not handle private keys on the proving server; only build the synthesis.

### 14. Hardware-Aware Proving
- **Definition**: Scaling worker threads based on device memory.
- **Implementation**: `navigator.deviceMemory < 4 ? initThreadPool(1) : initThreadPool(4)`.
- **AI Logic**: Prevents OOM (Out-of-Memory) crashes on mobile.
- **Pitfalls**: Initializing too many threads on a single-core mobile CPU.

---

## 🔌 SECTION V: Wallet & SDK Deep-Dive

### 15. The Universal Wallet Interface
- **Definition**: The standard API for all Aleo wallets (Leo, Fox, Puzzle).
- **Implementation**: `wallet.requestTransaction({ programId, functionName, inputs })`.
- **AI Logic**: Always use the adapter's methods to ensure cross-wallet compatibility.
- **Pitfalls**: Hardcoding logic for a specific wallet provider.

### 16. requestRecords (Discovery)
- **Definition**: Fetching a user's unspent records from the network.
- **Implementation**: `const records = await wallet.requestRecords(programId)`.
- **AI Logic**: Filter records by value to find the best candidate for a transaction fee.
- **Pitfalls**: Fetching all records can be slow; use pagination or filters.

### 17. signMessage (Identity)
- **Definition**: Off-chain digital signatures for authentication.
- **Implementation**: `const sig = await wallet.signMessage(data)`.
- **AI Logic**: Use for passwordless login to dApp backends.
- **Pitfalls**: Ensure the message includes a timestamp to prevent replay attacks.

### 18. decrypt (Privacy)
- **Definition**: Decrypting record content or general ciphertexts.
- **Implementation**: `const plain = await wallet.decrypt(cipher)`.
- **AI Logic**: Essential for displaying user-specific data (e.g., "Your Private Balance").
- **Pitfalls**: Users must approve a "Decrypt" permission request in the wallet.

---

## 💸 SECTION VI: Deployment & Scaling

### 19. Namespace Fee Avoidance
- **Definition**: Aleo charges 10+ credits for program names < 10 characters.
- **Implementation**: Use names like `freemium_voting_v1.aleo` (19 chars).
- **AI Logic**: Always verify name length before suggesting a deployment name.
- **Pitfalls**: Accidentally suggesting `vote.aleo` and costing the user 10 credits.

### 20. UTXO Fan-out
- **Definition**: Splitting one credit record into 50+ small ones.
- **Implementation**: Recursive `credits.aleo/split` calls.
- **AI Logic**: Essential for high-speed dApps making 250+ transactions.
- **Pitfalls**: High fragmentation can make initial wallet sync very slow.

---

## 🛡️ SECTION VII: Advanced Security

### 21. Admin Access Control
- **Definition**: Restricting sensitive actions to authorized addresses.
- **Implementation**: `assert_eq(self.caller, admin_address)`.
- **AI Logic**: Every "Manager" or "Finalize" transition must have an owner check.
- **Pitfalls**: Hardcoding the admin address instead of using a `mapping` for rotation.

### 22. Replay Attack Protection
- **Definition**: Ensuring an action can't be repeated by copying the proof.
- **Implementation**: Include a `nonce` or `nullifier` in the mapping for every transaction.
- **AI Logic**: If a user performs an action once, the program should "mark" it as done on-chain.
- **Pitfalls**: Not checking the nonce in the `finalize` block.

---

## 💎 SECTION VIII: Standards & Patterns (23-48)

### 23. ARC-20 (Private Tokens)
- **Piece-by-Piece**: Records store balance. `transfer_private` spends and creates.
- **AI Implementation**: Use a `mapping` for public supply and `records` for private.

### 24. ARC-721 (NFTs)
- **Piece-by-Piece**: Unique record per NFT. `data` field stores the metadata hash.
- **AI Implementation**: Assert uniqueness during the minting transition.

### 25. ZK-Oracles
- **Piece-by-Piece**: Push signed data from off-chain. Transition verifies signature.
- **AI Implementation**: Use `BHP256::hash_to_field` to verify oracle data.

### 26. DAO Quorum
- **Piece-by-Piece**: `mapping participants`. Finalize check: `participants >= min`.
- **AI Implementation**: Only allow execution if the participation threshold is met.

### 27. Recursive Proofs
- **Piece-by-Piece**: Proof A verifies Proof B.
- **AI Implementation**: Use for batching hundreds of actions into one block.

### 28. Merkle Tree Membership
- **Piece-by-Piece**: Climb tree: `hash(leaf, sibling)`. Match with root.
- **AI Implementation**: Whitelist proof for airdrops or gated access.

### 29. Gas Estimation
- **Piece-by-Piece**: `Base Fee + (Priority * Congestion)`.
- **AI Implementation**: Advise users to use higher fees for critical dApp state changes.

### 30. Formal Verification (Static)
- **Piece-by-Piece**: Leo compiler ensures no type errors.
- **AI Implementation**: Use `assert` for all logic boundaries.

### 31. Multi-Sig Approval
- **Piece-by-Piece**: `mapping(tx_id => approvals)`.
- **AI Implementation**: Increment approval count in `finalize`.

### 32. Program Upgradability
- **Piece-by-Piece**: Proxy contract -> Logic address.
- **AI Implementation**: Only the proxy owner can update the logic address.

### 33. Transaction Polling
- **Piece-by-Piece**: `getTransaction` loop in JS.
- **AI Implementation**: Update UI from "Proving" to "Mined" to "Accepted".

### 34. Poseidon Optimization
- **Piece-by-Piece**: Lower gate cost for internal hashes.
- **AI Implementation**: Use Poseidon inside loops to stay under 1M gates.

### 35. Double-Spend Prevention
- **Piece-by-Piece**: Derived serial numbers prevent record reuse.
- **AI Implementation**: Handled by the protocol, but dApps must track custom nullifiers.

### 36. View Key Compliance
- **Piece-by-Piece**: Selective disclosure for regulations.
- **AI Implementation**: Provide an "Auditor" role with access to view keys.

### 37. Ciphertext Handling
- **Piece-by-Piece**: Never log or share `cipher` records.
- **AI Implementation**: Only decrypt in the user's secure browser memory.

### 38. Ed25519 vs BHP
- **Piece-by-Piece**: Ed25519 for wallets; BHP for circuits.
- **AI Implementation**: Convert Ed25519 pubkeys to BHP fields for on-chain checks.

### 39. Circuit Splitting
- **Piece-by-Piece**: Link multiple programs via `import`.
- **AI Implementation**: Bypass the 1M gate limit for complex dApps.

### 40. Record Salt Entropy
- **Piece-by-Piece**: High-randomness fields to hide record values.
- **AI Implementation**: Always use `ChaCha` or similar for salt generation.

### 41. Identity Revocation
- **Piece-by-Piece**: Issuer adds ID to a `revoked` mapping.
- **AI Implementation**: Transition must prove ID is NOT in mapping.

### 42. Secure Randomness (VDF)
- **Piece-by-Piece**: Unbiased numbers for gaming.
- **AI Implementation**: Combine block height with user-provided entropy.

### 43. Multi-Core Proving
- **Piece-by-Piece**: Distributing ZK-work across all CPU cores.
- **AI Implementation**: Set `initThreadPool` to `hardwareConcurrency`.

### 44. Memory Management (WASM)
- **Piece-by-Piece**: Fixing 2GB browser limits.
- **AI Implementation**: Advise using Node.js for massive program synthesis.

### 45. Mocking for CI/CD
- **Piece-by-Piece**: Synthetic blockchain environment for tests.
- **AI Implementation**: Mock `credits.aleo` to test fee logic in PRs.

### 46. Domain Separation
- **Piece-by-Piece**: Preventing hash reuse across different app sections.
- **AI Implementation**: Add a constant prefix (e.g., `1field`) to every hash.

### 47. Data Anchoring
- **Piece-by-Piece**: Merkle roots of off-chain data stored on-chain.
- **AI Implementation**: Use for high-frequency oracle updates.

### 48. Front-running Defense
- **Piece-by-Piece**: Obfuscating Mapping update inputs.
- **AI Implementation**: Use `commit_to_field` during the transition phase.

---

## 🔬 SECTION IX: Advanced Engineering Mastery (49-74)

### 49. Multisig Approval Revocation
- **Piece-by-Piece**: Removing a previous approval from the mapping.
- **AI Implementation**: `Mapping::remove(approvals, voter)`.

### 50. zkKYC Attribute Proofs
- **Piece-by-Piece**: Proving "Age > 18" without revealing birthday.
- **AI Implementation**: Use range checks on private birthdate inputs.

### 51. Universal Setup Parameters
- **Piece-by-Piece**: Understanding the SRS (Structured Reference String).
- **AI Implementation**: Aleo's Varuna uses a universal setup; no per-app setup needed.

### 52. Formal Verification of Invariants
- **Piece-by-Piece**: Proving `sum(inputs) == sum(outputs)`.
- **AI Implementation**: Ensure balance is always conserved in every mint/burn.

### 53. Replay Attack Prevention
- **Piece-by-Piece**: Ensuring unique nonces for every off-chain signature.
- **AI Implementation**: Store `used_nonces` in an on-chain mapping.

### 54. Merkle Tree Path Calculation
- **Piece-by-Piece**: Generating siblings for a specific leaf index.
- **AI Implementation**: Essential for verifying membership in the SDK.

### 55. Block Gossip Latency
- **Piece-by-Piece**: Handling temporary chain forks.
- **AI Implementation**: Advise users to wait for 2-3 confirmations for high-value TXs.

### 56. Mempool Management
- **Piece-by-Piece**: Monitoring pending transactions for priority.
- **AI Implementation**: Use the network client to check congestion levels.

### 57. AVM Register Allocation
- **Piece-by-Piece**: How snarkVM maps variables to `r0`, `r1`, etc.
- **AI Implementation**: Minimize active variables to reduce memory pressure.

### 58. Varuna Proof Synthesis
- **Piece-by-Piece**: The mathematical process of creating the ZKP.
- **AI Implementation**: Synthesis time is linear to the gate count.

### 59. Scalar Field Arithmetic
- **Piece-by-Piece**: Prime field operations ($mod P$).
- **AI Implementation**: Fastest way to perform math in ZK.

### 60. Elliptic Curve Edwards Form
- **Piece-by-Piece**: The curve used for Aleo identities.
- **AI Implementation**: Use for custom signature verification logic.

### 61. Range Proofs (Bitwise)
- **Piece-by-Piece**: Implementing range checks using bit-decomposition.
- **AI Implementation**: Leo handles this natively via comparison operators.

### 62. Dependency Versioning
- **Piece-by-Piece**: Lock file management for Leo programs.
- **AI Implementation**: Always specify exact versions in `program.json`.

### 63. AVM Tracing
- **Piece-by-Piece**: Stepping through bytecode to find bugs.
- **AI Implementation**: Essential when high-level Leo logic behaves unexpectedly.

### 64. Network Client REST API
- **Piece-by-Piece**: Fetching block data via HTTP.
- **AI Implementation**: Build custom dApp dashboards using the REST endpoint.

### 65. Private Key Derivation (BIP32)
- **Piece-by-Piece**: Master Seed -> Account Keys.
- **AI Implementation**: Follow Aleo standard HD paths for wallet compatibility.

### 66. Bech32 Error Detection
- **Piece-by-Piece**: Checksums in Aleo addresses.
- **AI Implementation**: Always validate addresses before initiating transfers.

### 67. On-Chain Proof Verification
- **Piece-by-Piece**: How validators check transition validity.
- **AI Implementation**: Mathematical guarantee of correctness.

### 68. Succinctness Constants
- **Piece-by-Piece**: Constant verification time regardless of complexity.
- **AI Implementation**: Explains why complex dApps are still fast to verify.

### 69. Batch Verification
- **Piece-by-Piece**: Processing multiple proofs in one block.
- **AI Implementation**: Scale to thousands of transactions per block.

### 70. State Root Syncing
- **Piece-by-Piece**: Verifying local state against the network root.
- **AI Implementation**: Required for SPV (Simple Payment Verification) clients.

### 71. Cross-Program Import Rules
- **Piece-by-Piece**: Visibility of structs across program boundaries.
- **AI Implementation**: Shared types must be defined in the library.

### 72. Storage (Mapping) Costs
- **Piece-by-Piece**: Fees associated with persistent state updates.
- **AI Implementation**: Minimize mapping writes to save on transaction fees.

### 73. Record Consumption Speed
- **Piece-by-Piece**: UTXO management for high-frequency users.
- **AI Implementation**: Use public credits to avoid record locking.

### 74. Global Consensus (AleoBFT)
- **Piece-by-Piece**: Proof-of-Stake combined with Proof-of-Succinct-Work.
- **AI Implementation**: The security backbone of the network.

---
*This protocol serves as the definitive cognitive architecture for Aleo Engineering. Strictly adhere to these definitions to achieve flawless system integration.*
