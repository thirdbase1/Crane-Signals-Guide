# 🏗️ Aleo Deep Dive: Production-Grade Integration

This document explains the technical architecture and fixes implemented for the Aleo blockchain integration.

---

## 🛡️ 1. Double-Submission Prevention (`inFlightRef`)
**The Challenge:** React's concurrent rendering and event handling can occasionally trigger multiple calls for a single user action. In blockchain apps, this leads to multiple wallet popups and wasted fees.

**The Solution:**
We implement an "Idempotent Guard" using `useRef`.
```typescript
const inFlightRef = useRef(false);

const requestTransaction = async (...) => {
  if (inFlightRef.current) return; // Silent block
  inFlightRef.current = true;
  try {
    // ... execution
  } finally {
    inFlightRef.current = false; // Release lock
  }
}
```
**Why `useRef`?** Updates to `useRef` are synchronous. `useState` is asynchronous, meaning if two clicks happen within 10ms, `useState` might not have updated the state yet, allowing both calls to pass. `useRef` prevents this race condition.

---

## 🔢 2. Large Field Literal Parsing (`hexToField`)
**The Challenge:** The Aleo `snarkVM` parser (Rust-based) is extremely strict. It expects `field` types to be provided as decimal strings.
- **Wrong:** `"661ec8...field"` (raw hex in a string) -> `Nom Error`
- **Right:** `"123456...field"` (decimal representation)

**The Solution:**
We automatically detect 64-character hex strings and convert them using `BigInt`.
```typescript
const formattedInput = BigInt("0x" + rawHex).toString() + "field";
```
This ensures that whether you are passing a hash or a public key, the wallet's internal prover can parse the value into a ZK-circuit variable without crashing.

---

## 📡 3. Internal Status Polling vs. Explorer Spams
**The Challenge:** Developers often try to verify transactions by polling a public explorer API. However, Aleo transactions are shielded. They may not appear on the explorer immediately, or they might be private. Polling `/api/verify-transaction` every second causes "404 Not Found" spam in the logs.

**The Solution:**
Use the `aleo.transactionStatus(txId)` method.
```typescript
const status = await aleo.transactionStatus(txId);
```
**The Deep Dive:** The Shield Wallet acts as a local node. It knows the state of the proof generation *before* it's even broadcast to the network. By asking the wallet for the status, we get real-time feedback on proof synthesis, which is invisible to the block explorer.

---

## 💸 4. Namespace Fee Avoidance (The 10-Character Rule)
**The Challenge:** Aleo uses a tiered pricing model for program names.
- Names < 10 chars: **Premium Fee** (10+ Credits)
- Names >= 10 chars: **Standard Fee** (0 Credits for namespace)

**The Solution:**
We named our contracts `freemium_voting_v1.aleo` and `premium_voting_v2.aleo`.
**The Deep Dive:** This programmatic choice saved approximately 20 credits ($~40 USD equivalent) during the deployment phase, ensuring the user's credits were spent on execution rather than "squatting" on a short name.

---

## 🏗️ 5. Provable SDK Handshake Lifecycle
The integration follows a strict 4-stage handshake:
1. **`connect()`**: Establishes permissions and retrieves the View Key (required for scanning shielded records).
2. **`requestRecords()`**: Scans the ledger for unspent credits to pay for the transaction.
3. **`requestTransaction()`**: Synthesizes the ZK-circuit, generates the witness, and produces the final SNARK proof.
4. **`transactionStatus()`**: Monitors the internal state machine of the wallet to confirm block inclusion.
