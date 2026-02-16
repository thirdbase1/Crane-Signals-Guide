# 🧠 AGENTS.md: The Ultimate Aleo Technical Protocol (v2.0 - Exhaustive Guide)

This document is the definitive technical "skill" manual for any AI agent working with the Aleo blockchain. It codifies the architecture, language, and interaction protocols required to build zero-error, privacy-preserving decentralized applications.

---

## 🌎 1. Aleo Blockchain & Architecture Deep-Dive
Aleo is a Layer 1 blockchain using **Zero-Knowledge Proofs (ZKP)** for privacy and scalability.

- **AVM (Aleo Virtual Machine)**: Executes program logic. Programs are stored as bytecode on-chain but executed locally for proofs.
- **Varuna Proof System**: The modern SNARK system used by Aleo for universal proofs. It allows for succinct verification of complex circuits.
- **Record Model**: Private data objects. Every record has an `owner`, a `nonce`, and custom data.
- **Async/Finalize**: Separation between off-chain proof generation (transition) and on-chain state update (finalize). Transitions are proved locally; Finalize logic is executed by every node.

---

## ✍️ 2. Leo Language: Syntax, Types & Patterns
### Primitive Types & Literals
| Type | Literal Format | Bit-Size | Notes |
| :--- | :--- | :--- | :--- |
| **Address** | `aleo1...` | - | Bech32 encoded string. |
| **u8 / u16 / u32** | `1u8`, `1u16`, `1u32` | 8/16/32 | Standard unsigned integers. |
| **u64 / u128** | `100u64`, `1u128` | 64/128 | Used for high-precision math and balances. |
| **field** | `123field` | ~253 | Base unit of ZK arithmetic. Elements of the scalar field. |
| **group** | `1group` | - | Points on the Edwards curve. `generator` is a common constant. |
| **scalar** | `1scalar` | - | Used for group exponents. |
| **boolean**| `true`, `false`| 1 | Logical values. |

### Advanced State Management
1.  **Mappings**: Global state. `mapping name: key_type => value_type;`
2.  **Structs**: Complex data grouping. `struct Data { id: u64, info: field }`
3.  **Futures**: Essential for `async` transitions. They "wrap" the finalize call.

### Accurate Coding Patterns
- **Commit-Reveal**: Use `BHP256::hash_to_field(value)` to create a commitment. Reveal later by providing the original value + salt in a transition.
- **Stealth Addresses**: Use `group` math (`r * G`) to derive unique one-time addresses for private transfers.
- **Type Casting**: Use `cast r0 into r1 as TypeName;` or `r0 as TypeName;`

---

## 🔌 3. Wallet Adapter API & Nuances
### Library: `@provablehq/aleo-wallet-adaptor-react`

#### Core API Methods
1.  **`connect(adapterId: string, network: Network, permission: Permission): Promise<void>`**
2.  **`requestRecords(program: string): Promise<Record[]>`**: Critical for finding unspent "credits" or "tokens".
3.  **`requestTransaction(tx: AleoTransaction): Promise<string>`**: The primary way to execute transition functions.
4.  **`requestExecution(request: AleoExecution): Promise<string>`**: Specifically for executing a program with public or private inputs.
5.  **`decrypt(ciphertext: string): Promise<string>`**: Returns the plaintext of an encrypted record field or message.

#### 🛡 Wallet-Specific Nuances & Identifiers
| Wallet Name | Adapter ID | Key Strengths | Specific Requirements / "Wants" |
| :--- | :--- | :--- | :--- |
| **Leo Wallet** | `LeoWallet` | Dev-friendly, stable. | Standard implementation. Supports bulk transaction requests. |
| **Shield Wallet**| `ShieldWallet`| Max privacy focus. | Higher latency on `requestRecords`. Requires strict permission scopes. |
| **Puzzle Wallet**| `PuzzleWallet`| Multi-chain/asset. | **Return Format**: Often returns JSON-stringified records that must be manually parsed. |
| **Fox Wallet** | `FoxWallet` | Mobile optimization. | Highly sensitive to WASM thread count (`initThreadPool`). |
| **Soter Wallet** | `SoterWallet` | Enterprise security. | Strict input validation; fails early if suffixes (`u64`) are missing. |

---

## 🚀 4. High-Performance Proving (The Browser Bypass)
ZK-proving is heavy. To ensure stability:

### 1. Memory Management
Browsers often kill WASM workers if they exceed 2GB-4GB.
- **Solution**: Use `initThreadPool(1)` for low-memory environments (mobile) or `initThreadPool(os.cpus().length)` for desktops.

### 2. Remote Proving (API Logic)
If a client-side prove fails:
1.  Frontend sends Leo code/inputs to a Node.js backend.
2.  Backend uses `@provablehq/sdk` to run `buildDeploymentTransaction` or `execute`.
3.  Backend returns the **Unsigned Transaction Object**.
4.  Frontend calls `wallet.requestTransaction(unsignedTx)` for final signature.

---

## 🔍 5. Contract Inspector & Input Formatting
### Automated Parsing Logic
AI agents should look for these patterns in `.aleo` files:
- **Visibility**: `.public` (on-chain) vs `.private` (local proof only).
- **Inputs**: `input r0 as credits.aleo/credits.record;` -> Requires fetching an unspent record first.
- **Fee Suffix**: Credits are always `u64`. Example: `1.5 ALEO = 1500000u64`.

### Formatting & Encoding Utilities
```typescript
/**
 * Auto-formats values for Aleo transitions
 */
export const formatAleoInput = (val: any, type: string) => {
  if (type === 'u64') return `${val}u64`;
  if (type === 'field') {
      // Logic for prime reduction (mod 2^253 approx)
      const fieldVal = BigInt(val) % BigInt("211759232530467144869309935101340117170");
      return `${fieldVal}field`;
  }
  if (type === 'address') return val;
  return val;
}

/**
 * Encodes Hex to Field
 */
export const hexToField = (hex: string) => {
    return BigInt("0x" + hex.replace("0x", "")).toString() + "field";
}
```

---

## 🪲 6. Wallet Transaction Debugger
### Common Error Patterns
- **`4001` (User Rejected)**: Handled via `try/catch`.
- **`INVALID_PARAMS`**: Check if an input marked `private` in Leo is being passed as a `public` field in the SDK.
- **`INSUFFICIENT_CREDITS`**: User has enough balance but NO single unspent record large enough. **Fix**: Advise user to "Join" (Merge) their records in the wallet.
- **`NAMESPACE_FEE`**: Happens when program name is < 10 chars. **Fix**: Expand name length.

---

## 🛠 7. Interaction Code Examples

### Fetch & Filter Records
```typescript
const { requestRecords } = useWallet();
const getUnspent = async (program: string) => {
    const records = await requestRecords(program);
    return records.filter(r => !r.spent); // Essential filter
};
```

### Call a Deployed Contract
```typescript
const txId = await requestTransaction({
    programId: "premium_voting_v1.aleo",
    functionName: "create_premium_dao",
    inputs: [
        "12345field", // Name hashed
        "aleo1...", // token address
        "1000u64", // fee
        records[0], // Record required for fee payment
        "5000000u64" // Setup fee
    ],
    fee: 0.5
});
```

### Multi-Wallet Detection & Switching
```typescript
const { wallets, select } = useWallet();

// Dynamically list and select wallets
const handleSwitch = (name: string) => {
    const wallet = wallets.find(w => w.adapter.name === name);
    if (wallet) select(wallet.adapter.name);
};
```

---

## ⚡ 8. High-Speed Interaction (The Throughput Strategy)
To achieve high transaction volume (300+ calls) without failing:
1.  **Public Fee Mapping**: Send credits to the `credits.aleo` program's public mapping. This avoids UTXO record contention.
2.  **Stateless Proofs**: Design functions that don't depend on global state if possible, allowing for mass-parallel proof generation.
3.  **Prover Delegation**: For high-speed apps, use the backend API (`server/aleo-prover.ts`) to pre-generate unsigned transactions in parallel batches of 50+.

---
*This protocol serves as the definitive cognitive architecture for Aleo AI Agents. Strictly adhere to these definitions to achieve flawless system integration.*
