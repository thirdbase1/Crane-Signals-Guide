# 🗳️ Aleo Voting Contract (Final): Deployment, Fixes & API Guide

This document covers the successful deployment of `voting_v1.aleo` on the Aleo testnet. It includes a post-mortem of the fixes applied and instructions on how to call the contract from both the server-side and client-side.

---

## 🚀 Deployment Summary
*   **Program ID**: `voting_v1.aleo`
*   **Status**: Live & Upgradeable
*   **Transaction ID**: `at1wfhm0v9sva88wtudedy2ltfw0w7kyu8kqqegf8ym8frx4p0gqgqqk0lhqv`
*   **Namespace Fee**: 10 Credits (Premium name < 10 chars)
*   **Admin Address**: `aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl`

---

## 🛠️ Critical Fixes Applied

### 1. 🪙 Credits Integration
*   **Issue**: Original code used `import credit.leo;` and `credit.leo/transfer_private`.
*   **Fix**: Corrected to `import credits.aleo;` and properly handled the return type of `transfer_private` which is a tuple of two records: `(change_record, payment_record)`.

### 2. ⚡ Async/Finalize Structure
*   **Issue**: Mapping updates (`Mapping::set`) were attempted directly inside transitions.
*   **Fix**: Moved all state-changing logic to `async function` (finalize) blocks. In Aleo, transitions only handle local proofs; the ledger is only updated during the finalization phase.

### 3. 🛡️ Unique Voting Hash
*   **Issue**: `mapping voted: (u64, address) => bool;` (tuple keys) can be unstable or unsupported depending on the compiler edition.
*   **Fix**: Implemented a `VoteKey` struct which is hashed using `BHP256::hash_to_field`. This creates a deterministic, single-field key for the mapping, ensuring reliable double-voting prevention.

### 4. 🔄 Upgradeability
*   **Issue**: Standard programs are immutable.
*   **Fix**: Added `@admin(address="...")` to the constructor. This enables the admin address to upgrade the program logic in the future while preserving mapping data.

### 5. 📏 Block Height Logic
*   **Issue**: Hardcoded `0u32` for `created_block`.
*   **Fix**: Used the global `block.height` context in the finalize block to ensure every proposal has an accurate on-chain timestamp.

---

## 📞 How to Call the Contract

### 🖥️ Server-Side (Node.js/SDK)
Ideal for administrative tasks like `create_proposal` or `finalize_proposal`.

```typescript
import { Account, ProgramManager } from "@provablehq/sdk";

const account = new Account({ privateKey: process.env.ALEO_PRIVATE_KEY });
const programManager = new ProgramManager("https://api.explorer.provable.com/v1");
programManager.setAccount(account);

const txId = await programManager.execute(
    "voting_v1.aleo",
    "create_proposal",
    1.5, // Fee
    false,
    ["1u64", "12345field", "1000u64"]
);
```

### 📱 Client-Side (Wallet Adapter)
Required for `cast_private_vote` because the user must provide their own `credits` record as a fee.

```typescript
const { requestTransaction } = useWallet();

// Casting a vote requires:
// 1. Proposal ID (u64)
// 2. Vote Hash (field)
// 3. Nonce (field)
// 4. A credits record from the user's wallet
const handleVote = async () => {
    const inputs = ["1u64", "98765field", "1111field", "{CREDITS_RECORD_OBJECT}"];
    await requestTransaction({
        programId: "voting_v1.aleo",
        functionName: "cast_private_vote",
        inputs: inputs,
        fee: 0.5
    });
};
```

---

## 📜 Function List
1.  **`create_proposal(proposal_id, title_hash, duration)`**: Publicly registers a new voting event.
2.  **`cast_private_vote(proposal_id, vote_hash, nonce, credits_in)`**: Deducts 0.1 ALEO fee privately and issues a private vote record.
3.  **`finalize_proposal(proposal_id)`**: Admin-only (optional) or public toggle to lock a proposal from further votes.

---
*Developed by Jules - Automated Aleo Systems Engineer.*
