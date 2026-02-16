# 🧠 AGENTS.md: The Ultimate Aleo Technical Protocol

This document is the definitive technical "skill" manual for any AI agent working with the Aleo blockchain. It codifies the architecture, language, and interaction protocols required to build zero-error, privacy-preserving decentralized applications.

---

## 🌎 1. The Aleo Blockchain Architecture
Aleo is a Layer 1 blockchain that uses **Zero-Knowledge Proofs (ZKP)** to achieve both scalability and privacy. Unlike Ethereum (where state is public), Aleo is **private-by-default**.

### Core Concepts:
- **AVM (Aleo Virtual Machine)**: Executes Aleo Instructions. Programs are compiled into AVM bytecode.
- **Record Model**: Aleo's version of UTXO. A "Record" is a private data object owned by an address. When spent, it is consumed; when created, it is encrypted for the owner.
- **ZK-Proof System (Varuna)**: The underlying SNARK system that verifies computations without revealing inputs.
- **Off-Chain Computation, On-Chain Verification**: Heavy computation (ZK-proving) happens on the user's device (client) or a prover; only the tiny proof and transition outcomes go on-chain.

---

## ✍️ 2. Leo Language Specification (v3.4.0+)
Leo is a statically-typed, functional language designed for ZK circuits.

### Primitive Types & Literals:
| Type | Example Literal | Notes |
| :--- | :--- | :--- |
| **Integer** | `1u8`, `10u32`, `100u64` | Unsigned. Required for math. |
| **Field** | `1field`, `85732field` | Base unit for ZK arithmetic. |
| **Group** | `1group`, `generator` | For elliptic curve operations. |
| **Scalar** | `1scalar` | For curve exponents/multipliers. |
| **Address** | `aleo1...` | Account identifiers. |
| **Boolean** | `true`, `false` | Logical values. |

### Data Structures:
1.  **Structs**: Group data for computation.
    ```leo
    struct Proposal { id: u64, title: field }
    ```
2.  **Records**: Persistent, private data that can be spent. Must contain `owner: address`.
    ```leo
    record Coin { owner: address, amount: u64 }
    ```

### Program Logic:
- **`transition`**: Entry points. They generate ZK proofs.
- **`function`**: Helper logic within the circuit.
- **`inline`**: Code replaced at call site (no proof boundary).
- **`async transition`**: A transition that schedules on-chain state updates.
- **`async function` (finalize)**: Logic that runs on-chain to update `mapping` state.

---

## 🚀 3. Interacting with Smart Contracts
Interaction happens via the **Provable SDK** (`@provablehq/sdk`).

### High-Level Workflow:
1.  **Synthesis**: Compile the Leo code and generate proving/verifying keys.
2.  **Proving**: Generate a ZK-proof for a specific transition and its inputs.
3.  **Broadcasting**: Send the transaction (proof + public data) to the Aleo Network.

### Proving Strategies:
- **Local Proving**: Proof generated in-browser using WASM. Requires `SharedArrayBuffer` (COOP/COEP headers).
- **Remote Proving**: Move the `buildDeploymentTransaction` or `execute` synthesis to a Node.js backend to bypass browser restrictions.

### Handling Proofs & Transitions:
Every `transition` execution returns a `Transaction` object.
- **In-Circuit Logic**: Logic inside a transition is private. It generates a proof that the constraints were satisfied.
- **On-Chain Logic**: If a transition uses `async`, it generates a "Future". This Future is "awaited" in the `finalize` block on-chain by all nodes to update public state (mappings).
- **Verification**: Transitions are verified by checking the ZK-proof against the program's publicly registered **Verifying Key**.

---

## 🔌 4. Wallet Integration (`@provablehq/aleo-wallet-adaptor-react`)
This SDK allows React apps to connect to Aleo wallets (e.g., Leo Wallet).

### Setup:
```tsx
import { AleoProvider, WalletProvider } from "@provablehq/aleo-wallet-adaptor-react";
import { LeoWalletAdapter } from "@provablehq/aleo-wallet-adapter-leo";

export const App = () => {
  const wallets = useMemo(() => [new LeoWalletAdapter()], []);
  return (
    <AleoProvider chainId="testnet">
      <WalletProvider wallets={wallets} autoConnect>
        {/* Your App */}
      </WalletProvider>
    </AleoProvider>
  );
};
```

### Requesting Transactions:
The frontend **should not** see the user's private key. Instead, use the adapter to request a signature/broadcast.
```tsx
const { requestTransaction } = useWallet();

const executeCall = async () => {
    const tx = {
        programId: 'my_program.aleo',
        functionName: 'my_transition',
        inputs: ['1u8', 'aleo1...'],
        fee: 0.1
    };
    const txId = await requestTransaction(tx);
};
```

---

## 🛠 5. Deployment & Tools
### CLI Operations:
- `leo new <name>`: Create project.
- `leo build`: Verify syntax and generate AVM.
- `leo deploy`: Deploy to network (Requires credits).
- `leo execute`: Run transition on-chain.

### Network Economics:
- **Namespace Fee**: Program names < 10 characters cost **10-100+ credits**. Names >= 10 characters are **free** (standard synthesis fees only).
- **Microcredits**: 1 ALEO = 1,000,000 microcredits. Fees are specified in `u64` microcredits.

---

## ✅ 6. Protocol Best Practices for AI
1.  **Strict Typing**: Always append suffixes (`1u8`).
2.  **Async/Finalize**: Never use `Mapping` inside a regular `transition`. Move it to `async function`.
3.  **Upgradeability**: Always include `@admin(address="...")` or `@noupgrade` in the constructor.
4.  **Security**: Use environment variables for keys. Never hardcode.
5.  **Validation**: Run `leo test` before any deployment.

---
*This protocol ensures the AI acts as a Senior Aleo Engineer. Follow it strictly.*
