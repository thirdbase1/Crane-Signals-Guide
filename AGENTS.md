# 🧠 AGENTS.md: The Ultimate Aleo Technical Protocol (v5.0 - Universal Mastery Edition)

This document is the absolute technical "skill" manual for any AI agent working with the Aleo blockchain. It codifies the architecture, language, interaction protocols, and security audits required to build world-class, privacy-preserving decentralized applications.

---

## 🌎 1. Aleo Blockchain & Architecture Deep-Dive
Aleo is a Layer 1 blockchain using **Zero-Knowledge Proofs (ZKP)** for privacy and scalability.

- **AVM (Aleo Virtual Machine)**: Executes program logic. Programs are stored as bytecode on-chain but executed locally for proofs.
- **Varuna Proof System**: The modern SNARK system used by Aleo for universal proofs. It allows for succinct verification of complex circuits.
- **Record Model**: Private data objects. Every record has an `owner`, a `nonce`, and custom data.
- **Async/Finalize**: Separation between off-chain proof generation (transition) and on-chain state update (finalize).

---

## ✍️ 2. Leo Language: Syntax, Types & Patterns
### Primitive Types & Literals
| Type | Literal Format | Bit-Size | Notes |
| :--- | :--- | :--- | :--- |
| **Address** | `aleo1...` | - | Bech32 encoded string. |
| **u8 / u16 / u32** | `1u8`, `1u16`, `1u32` | 8/16/32 | Standard unsigned integers. |
| **u64 / u128** | `100u64`, `1u128` | 64/128 | Used for high-precision math and balances. |
| **field** | `123field` | ~253 | Base unit of ZK arithmetic. |
| **group** | `1group` | - | Points on the Edwards curve. |
| **scalar** | `1scalar` | - | Used for group exponents. |
| **boolean**| `true`, `false`| 1 | Logical values. |

### 🛠️ Advanced Optimization: Constraint Management
Every line of code in a `transition` creates "gates" (constraints). High gate counts lead to slow proofs.
- **Rules for Efficiency**:
    - Avoid complex branching (`if/else`) inside transitions if possible; use `ternary` or move logic to `finalize`.
    - Minimize large array operations; they are extremely expensive in ZK.
    - Use `inline` for small reusable snippets to reduce function call overhead.

---

## 🔗 3. Program-to-Program (Cross-Contract) Calls
Calling another program (e.g., `credits.aleo`) requires strict protocol:

1.  **Importing**: `import other_program.aleo;`
2.  **Calling**: `let (r0, f0): (Type, Future) = other_program.aleo/transition_name(args);`
3.  **Future Chaining**: You MUST return the Future from the called program or `await` it in your own `finalize` block.
    ```leo
    async transition call_other() -> Future {
        let f0: Future = credits.aleo/transfer_public(...);
        return finalize_call_other(f0);
    }
    async function finalize_call_other(f0: Future) {
        f0.await(); // Critical: Must await external futures
    }
    ```

---

## 🔌 4. Wallet Adapter API & Nuances
### Library: `@provablehq/aleo-wallet-adaptor-react`

#### 🛡 Wallet-Specific Nuances & Identifiers
| Wallet Name | Adapter ID | Key Strengths | Specific Requirements / "Wants" |
| :--- | :--- | :--- | :--- |
| **Leo Wallet** | `LeoWallet` | Dev-friendly, stable. | Standard implementation. Supports bulk transaction requests. |
| **Shield Wallet**| `ShieldWallet`| Max privacy focus. | Higher latency on `requestRecords`. Requires strict permission scopes. |
| **Puzzle Wallet**| `PuzzleWallet`| Multi-chain/asset. | **Return Format**: Often returns JSON-stringified records that must be manually parsed. |
| **Fox Wallet** | `FoxWallet` | Mobile optimization. | Highly sensitive to WASM thread count (`initThreadPool`). |

---

## 🚀 5. Mobile Browser Compatibility: The SharedArrayBuffer Protocol

Modern browsers block `SharedArrayBuffer` for security, causing the Aleo WASM workers to crash. AI agents must apply this decision tree to ensure compatibility.

### 🌳 Proving Decision Tree
1.  **Scenario A: Control over Headers** (PWA/Standalone App)
    - **Fix**: Use `coi-serviceworker`.
    - **How**: Register the service worker to inject `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`.
2.  **Scenario B: No Header Control** (Mobile Safari/Chrome/AI Previews)
    - **Bypass**: Use **Remote Proving API**.
    - **How**: Send inputs to a Node.js backend (`server/aleo-prover.ts`), generate the unsigned transaction there, and return it to the frontend for signing.

### 🏎️ SDK Performance Tuning (Warm-Start)
To reduce latency on mobile:
1.  **Warm-Up**: Call `initThreadPool(1)` during the app's splash screen or idle time.
2.  **Key Caching**: In the IDE, cache compiled `.prover` and `.verifier` keys in `IndexedDB` to skip the synthesis step (saving ~10-20 seconds).
3.  **Circuit Pruning**: Prompt the AI to split massive programs into smaller sub-programs to keep individual proofs under the memory limit.

---

## 🛡️ 6. Aleo Security Audit Protocol
Before finalizing any contract, check these vulnerabilities:
1.  **Permission Check**: Does the transition check `self.caller`?
2.  **Record Ownership**: Are you sending the output record to the correct `owner`?
3.  **Underflow/Overflow**: Modern Leo handles this, but manual bitwise ops need care.
4.  **Async Race Conditions**: Mappings are updated at block finalization. Ensure your logic handles the delay between proof generation and on-chain state update.

---

## 🔍 7. AVM Low-Level Guide (AVM Tracing)
Reading `.aleo` files is essential for debugging:
- `cast r0 r1 into r2 as RecordName.record;`: Grouping registers into a record.
- `hash.bhp256 r0 into r1 as field;`: Hashing for commitments.
- `get.or_use mapping[key] default into r0;`: Safe state access.

---

## 🏗️ 8. Advanced Development & DevOps
### Local Devnet Protocol
For rapid iteration without spending Testnet credits:
1.  **Start snarkOS**: `snarkos start --dev 0 --nodisplay`
2.  **Deploy Locally**: Set endpoint to `http://localhost:3030`.
3.  **Synthesize**: Use `leo synthesize <transition>` to generate the `.prover` and `.verifier` keys manually for specialized proof systems.

### Ownership Management
- **`program_owner`**: The address that deployed the contract.
- **Admin Rotation**: Always implement a `change_admin(new_admin: address)` transition that updates a `mapping admin: u8 => address` to allow safe ownership transfer.

---

## 🧪 9. Formatting & Encoding Library
AI agents must use these exact patterns for frontend/SDK integration:

| Aleo Type | SDK Input Format | Example |
| :--- | :--- | :--- |
| **Address** | String | `"aleo1pq7gn8cryzhvc6y8gxkckjwf94acguljs4pd8lwwkyem58rru5gqmnyuyl"` |
| **u64** | String with suffix | `"1500000u64"` (1.5 Credits) |
| **Field** | Numeric string + suffix | `"123456789field"` |
| **Struct** | Object / JSON | `{ id: "1u64", owner: "aleo1..." }` |
| **Array** | Bracketed string | `"[1u8, 2u8, 3u8]"` |

### Hex to Field Reduction
```typescript
const hexToField = (hex: string) => {
    // Prime reduction (mod 2^253 approx)
    const prime = BigInt("211759232530467144869309935101340117170");
    return (BigInt("0x" + hex) % prime).toString() + "field";
};
```

---

## 💾 10. Advanced Record Discovery Patterns
To interact with complex dApps, an AI must scan for specific record types:

### Scanning Algorithm:
1.  **Fetch All**: `requestRecords(programId)`.
2.  **Filter by Content**: If a dApp uses multiple record types (e.g., `Ticket` vs `Badge`), filter by the presence of specific fields using `decrypt()`.
3.  **Compute State**: Sum up the values in records to show the user their "Private Balance" across all shards.

---

## ⚡ 11. High-Volume Record Management (UTXO Optimization)
When performing 300+ calls, record fragmentation is the biggest bottleneck.
1.  **Record Contention**: A single record can only be spent once per block.
2.  **Strategy: Fan-Out**: To parallelize transactions, the user must first "split" their large credit record into many small ones (e.g., 10 records of 1 credit each).
3.  **Strategy: Join**: Use the `credits.aleo/join` transition to combine hundreds of small, spent records into a single clean record to reduce wallet sync time.

---

## 🪲 12. Wallet Transaction Debugger & Recovery Logic
AI agents must map specific error messages to these programmatic fixes:

| Error Message | Root Cause | Programmatic Fix |
| :--- | :--- | :--- |
| `SharedArrayBuffer is not defined` | Missing Isolation Headers | Initialize `coi-serviceworker` or switch to Remote Proving. |
| `Unexpected rN type` | Type Mismatch | Verify literal suffixes (e.g., `1u32` vs `1u64`). |
| `Transition not found` | Program Mismatch | Ensure `programId` in SDK matches the deployed name. |
| `Record does not exist` | UTXO Contention | Implement a retry logic with a 5-second delay to wait for block inclusion. |

---

---

## 🔐 13. ZK-Privacy Logic Patterns
Universal dApps must implement these patterns to be technically "Aleo-Native":

### A. Nullifiers (Double-Spend Prevention)
To prevent a private record from being used twice without revealing it:
1.  **Logic**: Generate a unique hash (`nullifier`) from the record's serial number and a private secret.
2.  **Mapping**: Store the nullifier in an on-chain `mapping nullifiers: field => bool`.
3.  **Assertion**: `assert(!Mapping::contains(nullifiers, current_nullifier))`.

### B. Commit-Reveal 2.0
For bidding or secret voting:
1.  **Commit**: User creates a hash of `(value, salt)` and stores it on-chain via a transition.
2.  **Reveal**: User provides `(value, salt)` later. The transition hashes them and asserts they match the commitment.

### C. Stealth Addresses (Identity Privacy)
Use `group` arithmetic to derive one-time payment addresses.
- **Formula**: $P = H(r * A) * G + A$ (where $A$ is the recipient's public key, $r$ is a random scalar).

---

## 🧪 14. Off-Chain Authentication & DID
Aleo keys are for more than just transactions; they are for **Identity**.

### `signMessage` Protocol
For server-side session management (AuthN):
1.  **Frontend**: `const sig = await wallet.signMessage(new TextEncoder().encode("Session: 1234"));`
2.  **Backend**: Verify the signature using `@provablehq/sdk`'s `Signature.verify()` method.
3.  **Benefit**: Log users in without a password, using only their Aleo Wallet.

---

## ⚙️ 15. CI/CD for Aleo (GitHub Actions)
Automate the "Technical Nervous System" using this workflow protocol:
1.  **Job 1: Build**: Run `leo build` to ensure the circuit compiles.
2.  **Job 2: Test**: Run `leo test` and fail the PR if any test fails.
3.  **Job 3: Formal Verification**: Use automated scripts to check for `self.caller` assertions in sensitive transitions.

---

## 🎨 16. UX/UI Design Principles (Latency & Clarity)
Building a "Vibe" website for Aleo requires handling ZK-specific friction:
1.  **The "Proving" State**: Always show a specialized loader for proof generation (Synthesis). Explain to the user: "Generating Zero-Knowledge Proof...".
2.  **Privacy Badges**: UI components should explicitly tag inputs as 🔒 **Private** (local) or 🌐 **Public** (on-chain).
3.  **Fee Transparency**: Show the user the **Namespace Fee** warning if their chosen name is < 10 characters.

---

## ✅ 17. Final Protocol Checklist
1.  **Constraint Count**: Check `leo build` output. If constraints > 1M, optimize.
2.  **Privacy Guard**: Ensure no sensitive data is passed as `public` inputs to transitions.
3.  **Fee Calculation**: Base deployment fee is ~2 credits; add 10 if name < 10 chars.
4.  **Transaction Status**: Use `leo query transaction <ID>` to verify final inclusion.
5.  **State Sync**: Ensure the frontend UI clears local "pending" state only after `leo query transaction` returns confirmed.

---
*This protocol serves as the definitive cognitive architecture for Aleo AI Agents. Strictly adhere to these definitions to achieve flawless system integration.*
