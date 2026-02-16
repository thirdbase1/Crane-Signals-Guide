# 🧠 AGENTS.md: The Ultimate Aleo Mastery Protocol (v8.0 - Universal Master Engineering Edition)

This document is the absolute technical "brain" for any AI agent or senior engineer working with the Aleo blockchain. It codifies the architecture, language, interaction protocols, wallet deep-dives, and 48+ specialized technical sections required for world-class, privacy-preserving engineering.

---

## 🌎 1. Aleo Blockchain Architecture & Ledger Model
Aleo is a Layer 1 blockchain using **Zero-Knowledge Proofs (ZKP)** for privacy and scalability.
- **snarkVM**: The execution engine implementing the **Varuna** proof system and the **Record model**.
- **Async/Finalize Separation**:
    - **Transitions**: Off-chain ZK-proof generation. Private by default.
    - **Finalize**: On-chain state updates. Public and verifiable by all nodes.
- **Record Model**: Private data objects (UTXO-like). Spent exactly once.
- **snarkOS**: The P2P network protocol for AleoBFT consensus and state sync.

---

## ✍️ 2. Leo Language: Syntax & Mastering the AVM
AI agents MUST use explicit type suffixes.
- **Integers**: `1u8`, `1u16`, `1u32`, `1u64`, `1u128`, `1i8`.
- **ZKP Primitives**: `1field`, `1group`, `1scalar`.
- **Optimization**: Use `inline` for small reusable snippets to reduce gate counts.
- **Constructor**: `@admin(address=...) async constructor() {}`.

---

## 🔒 3. Advanced Privacy Patterns
- **The Nullifier Pattern**: Double-spend prevention via mapping(field => bool).
- **Stealth Addresses**: $P = H(r * A) * G + A$.
- **Commit-Reveal**: Secret commitments ($Hash(vote, salt)$) for delayed disclosure.
- **View Keys**: Selective record visibility without spending authority.

---

## 🚀 4. Environment Mastery: Web, Mobile & Node.js
- **SharedArrayBuffer Protocol**: Inject `COOP/COEP` headers via `coi-serviceworker`.
- **Remote Proving API**: Backend synthesis for restricted mobile/secure browsers.
- **Hardware Awareness**: Check `navigator.deviceMemory` before high-thread initialization.

---

## 🔌 5. Comprehensive Wallet Deep-Dive: Provable SDK & Adapters
Every Aleo Wallet Adapter follows a standard interface but has critical nuances. AI agents must implement these calls with 99% accuracy.

### 🛠️ Common Wallet Interface Methods
| Method | Syntax | Description |
| :--- | :--- | :--- |
| `connect` | `await wallet.connect(network, scope)` | Permission request. Scope: `['decrypt', 'records', 'sign']`. |
| `disconnect`| `await wallet.disconnect()` | Cleanly end session. |
| `publicKey` | `wallet.publicKey` | Returns the Bech32 address. |
| `viewKey` | `await wallet.viewKey()` | Returns the private View Key (requires scope). |
| `requestRecords`| `await wallet.requestRecords(programId)` | Fetches unspent records for the user. |
| `requestTransaction`| `await wallet.requestTransaction(txRequest)` | Deploy or execute a program. |
| `requestExecution`| `await wallet.requestExecution(execRequest)` | Specifically for calling transitions. |
| `requestDeploy` | `await wallet.requestDeploy(deployRequest)` | Push new Leo bytecode to the network. |
| `signMessage` | `await wallet.signMessage(uint8Array)` | Off-chain identity verification. |
| `decrypt` | `await wallet.decrypt(ciphertext, tpName?)` | Decrypts record or general ciphertext. |

### 🛡️ Wallet-Specific Nuances
1.  **Leo Wallet (`LeoWalletAdapter`)**:
    - **Bulk Requests**: Supports `requestBulkTransactions` for parallel processing.
    - **Performance**: High stability; works best with `initThreadPool(os.cpus().length)`.
2.  **Fox Wallet (`FoxWalletAdapter`)**:
    - **Mobile-First**: Extremely sensitive to WASM memory. Default to 1-2 threads.
3.  **Puzzle Wallet (`PuzzleWalletAdapter`)**:
    - **Data Format**: Returns records as JSON strings; must be parsed before SDK usage.
    - **Permissions**: Requires specific `programIdPermissions` object in constructor.
4.  **Soter Wallet (`SoterWalletAdapter`)**:
    - **Latency**: Slower `decrypt()` calls; implement UI loaders.
5.  **Shield Wallet (`ShieldWalletAdapter`)**:
    - **Privacy Focus**: Aggressively hides metadata; requires explicit scope for `viewKey`.

---

## 💸 6. Deployment & Scaling Strategy
- **Namespace Fee**: Program names < 10 chars incur premium costs. Always use 10+ characters. Use `optimizeProgramName` utility from `script/aleo-utils.ts` to automate this.
- **UTXO Management**: Split (Fan-Out) and Join (Merge) records to avoid block contention.

---

## 🛡️ 7. Security & Audit Protocol
- **Admin Lock**: `assert_eq(self.caller, admin)`.
- **Replay Attack Prevention**: Use unique per-transaction salts in records.

---

## ⚙️ 8. CI/CD & Verification
- **Test Suite**: Always execute `leo test` before any deployment.
- **AVM Tracing**: Inspect `.aleo` files to ensure correct register-to-record casting.

---

## 💎 9. Token Standards: ARC-20 (Private & Public)
- Private balances as records; public balances as mappings.
- Must implement `join` and `split` for private records to handle UTXO fragmentation.

---

## 🖼️ 10. NFT Standards: ARC-721
- Unique records with `data` field (BHP hash of metadata/IPFS).
- Private transfers via record ownership change; public metadata for indexing.

---

## 🔮 11. Oracles: Pull vs. Push Models
- **Push**: Admin updates mapping periodically.
- **Pull (ZK-Oracle)**: User provides ZK-proof of signed external data for immediate verification.

---

## 🗳️ 12. DAO Governance
- Lifecycle: Create -> Private Vote -> Admin Tally -> Execution.
- Quorum checks MUST happen in the `finalize` block.

---

## 🏢 13. Multi-Signature Wallets
- M-of-N logic using mappings to track threshold approvals for specific transaction IDs.

---

## 🏗️ 14. Program Upgradability Patterns
- **Proxy Pattern**: Use a stable Proxy program that points to a mutable logic address in a mapping.

---

## ⚡ 15. Gas & Priority Fee Strategies
- Base fee = Circuit Complexity.
- Priority fee = inclusion speed. Use `fee_public` to avoid record locking.

---

## 🧪 16. Formal Verification for Leo
- Use `leo check` and heavy assertions to verify state invariants mathematically.

---

## 🔗 17. Cross-Chain Bridges
- Lock-and-Mint pattern: ZK-proof of Ethereum lock triggers minting on Aleo.

---

## 🆔 18. Zero-Knowledge Identity (zkKYC)
- Prove age/location via signed issuer records without revealing PII.

---

## 🎲 19. Secure Randomness
- Use `BHP256::hash_to_field(seed)` where seed includes block height + private user entropy.

---

## 📦 20. Package Management
- Manage dependencies in `program.json`. Use network imports like `import credits.aleo;`.

---

## 🐛 21. Debugging with snarkOS-explorer
- Analyze ciphertext records in explorer to verify input/output correctness.

---

## 🏎️ 22. High-Throughput Execution
- Multi-worker scripts (`worker-bulk.sh`) using the `--broadcast` flag for mempool saturation.

---

## 📜 23. AleoBFT Consensus & Finalization
- **Consensus**: HotStuff-based BFT mechanism.
- **Finalization**: Transactions are finalized when included in a block and accepted by a quorum of validators.
- **Developer Note**: State changes in `finalize` are immediate upon block inclusion.

---

## 🌳 24. Merkle Tree Implementation in Leo
- Verify membership proofs by hashing a leaf and its siblings up to the stored root.
- **Pattern**: `let root: field = hash_up(leaf, proof_array); assert_eq(root, stored_root);`.

---

## 📡 25. Transaction Status Polling Logic
- Standard states: `Queued` -> `Generating Proof` -> `Broadcasting` -> `Accepted` / `Rejected` / `Failed`.
- Use the SDK's `getTransaction(txId)` in a 3-second loop for confirmation.

---

## 🔢 26. Record Nonce & Double-Spend Prevention
- Every record has a unique `nonce`.
- When spent, a `serial_number` is derived. The network rejects any transaction spending a record with an already-seen serial number.

---

## 🛠️ 27. Serial Number Calculation (AVM Internal)
- `SN = BHP256(RecordViewKey, Nonce)`.
- Only the owner (holding the View Key) can calculate the serial number, preserving spend privacy.

---

## 🏷️ 28. BHP Hash Suffixes & Domain Separation
- Use unique suffixes for different hash purposes: `BHP256::hash_to_field(data + 1field)` vs `(data + 2field)` to prevent cross-domain collisions.

---

## 🚀 29. Poseidon vs BHP Optimization
- **Poseidon**: 10x faster inside ZK-circuits (lower constraints). Use for internal hashing.
- **BHP**: Standard for on-chain IDs and addresses. Use for external compatibility.

---

## 🚧 30. Gate Count Minimization
- Stay under **1,000,000 gates** per transition.
- **Trick**: Move complex non-privacy-critical math to `finalize` where constraints are cheaper/unlimited.

---

## 🔄 31. Recursive Proofs in snarkVM
- The Varuna proof system allows for proofs that verify other proofs.
- **Developer Goal**: Use this for massive batching of transactions into a single on-chain proof.

---

## 💰 32. Program Credit Verification
- Check a program's balance before execution: `get credits.aleo/account[program_address] into balance;`.

---

## 🔑 33. Record Ciphertext vs Plaintext Handling
- Plaintext records are only visible during the transition.
- Ciphertext is what is stored on-chain. Decrypt using the `ViewKey` on the client side.

---

## 🖋️ 34. Signatures: Ed25519 vs BHP
- **Ed25519**: Standard for wallet signatures (`signMessage`).
- **BHP**: Used for internal circuit-friendly signatures and identities.

---

## 🏛️ 35. Handling Large Program Deployments
- If a program exceeds gate limits, split it into multiple sub-programs and link them via `import`.

---

## 🔍 36. Local vs Network Record Discovery
- **Local**: Scan local encrypted database (wallet). Fast, but might miss new records.
- **Network**: Query `api.explorer.provable.com`. Slower, but 100% accurate.

---

## 💾 37. WASM Memory Flags & Overflows
- In browsers, Aleo WASM can exceed the 2GB memory limit.
- **Fix**: Use `--max-memory=4096` during compilation or reduce thread counts on mobile.

---

## 🧪 38. CI/CD for Provable SDK Integration
- Mock the `Account` and `RecordProvider` in GitHub Actions to test program execution without real wallet interactions.

---

## 🧂 39. Secure Salt Generation for Records
- Always use a random `field` as a salt. A predictable salt allows attackers to brute-force the record content.

---

## 👤 40. Admin Signature Patterns (Off-chain)
- Instead of checking `self.caller`, verify a signature of the transition inputs signed by the admin's private key.

---

## 🛑 41. Multisig Approval Revocation
- Implement a `revoke_approval` transition that removes the user's signature from the pending transaction mapping.

---

## 🆔 42. Identity Revocation (zkKYC)
- Issuers store a `revocation_status` mapping. Users must prove their `Identity` record's unique ID is NOT in the revocation list.

---

## ⚓ 43. Data Anchoring for Oracles
- Store a Merkle Root of external data on-chain. Users prove a specific price point belongs to that root.

---

## ✅ 44. Formal Verification of State Invariants
- Assert that `total_supply == sum(individual_balances)` in every mint/burn transition.

---

## 🔄 45. Replay Attack Prevention
- Include a unique `nonce` or `counter` in every signed message or transition input.

---

## 🏃 46. Front-running in Finalize Blocks
- Use **Commit-Reveal** to prevent other users from seeing your mapping update inputs before the block is finalized.

---

## 💧 47. Data Leakage Prevention in Transitions
- Never pass private record data as `public` inputs to a transition. Always use `private` inputs for sensitive fields.

---

## 🎭 48. Mocking Records for Advanced Testing
- Create helper transitions that "mint" test records with specific metadata to simulate complex dApp states during `leo test`.

---
*This protocol serves as the definitive cognitive architecture for Aleo Engineering. Strictly adhere to these definitions to achieve flawless system integration.*
