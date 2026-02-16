# 🧠 AGENTS.md: The Ultimate Aleo Technical Protocol (Advanced Skill Guide)

This document is the definitive technical "skill" manual for any AI agent working with the Aleo blockchain. It codifies the architecture, language, and interaction protocols required to build zero-error, privacy-preserving decentralized applications.

---

## 🌎 1. Aleo Blockchain & Architecture
Aleo is a Layer 1 blockchain using **Zero-Knowledge Proofs (ZKP)** for privacy and scalability.

- **AVM (Aleo Virtual Machine)**: Executes program logic.
- **Record Model**: Private data objects. Spending a record consumes it and creates new ones.
- **Async/Finalize**: Separation between off-chain proof generation (transition) and on-chain state update (finalize).

---

## ✍️ 2. Leo Language & Type System
### Primitive Types & Literals
| Type | Literal Format | Encoding Logic |
| :--- | :--- | :--- |
| **Address** | `aleo1...` | Bech32 encoded string. |
| **u8** | `1u8` | 8-bit unsigned integer. |
| **u64** | `100u64` | 64-bit unsigned integer (common for balances/fees). |
| **field** | `123field` | Base unit of ZK arithmetic (~253 bits). |
| **group** | `1group` | Elliptic curve points. |
| **scalar** | `1scalar` | Multipliers for groups. |
| **boolean**| `true`, `false`| Logical values. |

### Field Encoding Rules
- **Prime reduction**: Fields are elements of the prime $p \approx 2^{253}$.
- **Hex conversion**: To convert hex to field, use `BigInt("0x...")` and format as `BigInt.toString() + "field"`.
- **Serialization**: Records are serialized as strings or JSON objects depending on the SDK level.

---

## 🔌 3. Wallet Adapter API Reference
### Library: `@provablehq/aleo-wallet-adaptor-react` / `core`

#### Core Method Signatures:
1.  **`requestRecords(program: string): Promise<Record[]>`**
    *   Returns array of encrypted/unspent records.
2.  **`requestTransaction(tx: AleoTransaction): Promise<string>`**
    *   `AleoTransaction` fields: `address`, `programId`, `functionName`, `inputs[]`, `fee`, `privateFee`.
    *   Returns the transaction ID (string).
3.  **`signMessage(message: Uint8Array): Promise<Uint8Array>`**
    *   Standard signing for authentication.
4.  **`decrypt(ciphertext: string): Promise<string>`**
    *   Decrypts local data using the private key.

#### Wallet-Specific Nuances:
- **Leo Wallet**: Full implementation. Supports bulk transactions.
- **Shield Wallet**: High privacy, slightly slower record fetching.
- **Puzzle Wallet**: Multi-chain support, requires specific `fee` formatting.
- **Fox Wallet**: Optimized for mobile performance.

---

## 🔍 4. Contract Inspector & Parsing Logic
AI should parse `.aleo` (AVM) files to auto-detect requirements:

### Extraction Patterns:
- **Functions**: `function ([a-z0-9_]+):`
- **Visibility**: Detect `.private` or `.public` modifiers on inputs/outputs.
- **Inputs**: `input r(\d+) as ([a-z0-9\./]+)\.(public|private);`
- **Mappings**: `mapping ([a-z0-9_]+):` detects global state requirements.

---

## 🧪 5. Input Formatting Utilities
### Auto-Generation Strategy:
1.  Parse contract for `input rN`.
2.  Map frontend state to the ordered input array.
3.  **Validation**:
    - Ensure all numbers have `u8`/`u64`/etc suffixes.
    - Ensure all strings are valid `address` or `field`.
    - Wrap complex types in `"` if passing via JSON RPC.

---

## 🪲 6. Wallet Transaction Debugger
### Common Errors & Required Fixes:
- **`INVALID_PARAMS`**: Usually a mismatch in input count.
  - *Check*: Contract has 4 inputs, but frontend sent 3.
- **`USER_REJECTED` (4001)**: User cancelled.
  - *Fix*: Re-trigger the UI or notify the user.
- **`INSUFFICIENT_CREDITS`**: Wallet has < 12 credits for a short-name program deployment.
  - *Fix*: Rename to > 10 characters or fund the wallet.
- **`PROGRAM_NOT_FOUND`**: Deployment failed or network mismatch (e.g., trying Testnet program on Mainnet).

---

## 🛠 7. Interaction Code Database

### Record Fetching & Filtering:
```typescript
const records = await requestRecords("credits.aleo");
const unspent = records.filter(r => !r.spent);
```

### High-Volume Transaction Call:
```typescript
const tx = await requestTransaction({
    programId: "voting_v1.aleo",
    functionName: "cast_private_vote",
    inputs: ["1u64", "123field", "456field", records[0]],
    fee: 0.1
});
```

---
*This document acts as the technical nervous system for the Aleo AI agent. Follow it to maintain 100% operational accuracy.*
