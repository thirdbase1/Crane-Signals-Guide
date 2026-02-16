# 💎 Aleo Premium Voting Smart Contract: Deployment & Refinement

This document covers the deployment of the `premium_voting_v2_ultimate.aleo` program. This contract implements a "Freemium" DAO subscription model and private voting records.

---

## 🚀 Deployment Status
*   **Program ID**: `premium_voting_v2_ultimate.aleo` (Ultimate Edition)
*   **Status**: Compiled & Ready for Deployment
*   **Checksum**: `[58u8, 163u8, 18u8, 209u8, 236u8, 70u8, 23u8, 147u8, 183u8, 49u8, 8u8, 182u8, 232u8, 119u8, 143u8, 145u8, 32u8, 116u8, 167u8, 97u8, 80u8, 137u8, 156u8, 30u8, 154u8, 233u8, 9u8, 10u8, 100u8, 162u8, 167u8, 244u8]`
*   **Network**: Aleo Testnet

---

## 🛠️ Critical Fixes & Logic Refinements

### 1. 🪙 Credits Record Interaction
*   Integrated `credits.aleo/transfer_private`. In Aleo, credits are records that must be spent via specialized transitions. I properly handled the input record and the returned `(change, payment)` tuple.

### 2. ⚡ Zero-Fee Transfer Bug Fix (v2)
*   **Issue**: Calling `transfer_private` with a `0u64` amount causes transaction failure.
*   **Solution**: Split the logic. `subscribe_to_dao` now enforces a paid fee for subscriptions > 10 proposals. A new `subscribe_free` transition handles the freemium tier without triggering a credit transfer.

### 3. 🛡️ Record Compliance
*   Every `record` in Leo requires an `owner` field of type `address`. Added this to `ProposalRecord`, `VoteRecord`, and `DaoSubscription` to ensure the ZK-circuit compiled correctly.

---

## 📞 API Usage Guide

### 📱 Client-Side (Frontend Wallet Adapter)
```typescript
const { requestTransaction } = useWallet();

const handleCreateDAO = async () => {
    const inputs = [
        "name_field",
        "aleo1...", // token address
        "1000u64", // subscription fee
        "{CREDITS_RECORD_OBJECT}",
        "5000000u64"
    ];

    await requestTransaction({
        programId: "premium_voting_v2_ultimate.aleo",
        functionName: "create_premium_dao",
        inputs: inputs,
        fee: 0.5
    });
};
```

---

## 📜 Function Overview
1.  **`create_premium_dao`**: Initializes a DAO record. Requires a 5 ALEO setup fee sent to the treasury.
2.  **`subscribe_to_dao`**: Issues a `DaoSubscription` record for paid tiers.
3.  **`subscribe_free`**: Issues a `DaoSubscription` record for the free tier (first 10 proposals).
4.  **`cast_vote`**: Generates a private `VoteRecord` for the user.

---
*Developed by Jules - Automated Aleo Systems Engineer.*
