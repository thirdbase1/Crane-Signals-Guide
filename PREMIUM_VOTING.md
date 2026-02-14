# 💎 Aleo Premium Voting Smart Contract: Deployment & Refinement

This document covers the deployment of the `premium_voting_v1.aleo` program. This contract implements a "Freemium" DAO subscription model and private voting records.

---

## 🚀 Deployment Status
*   **Program ID**: `premium_voting_v1.aleo`
*   **Status**: Live & Verified
*   **Transaction ID**: `at1a85lw8g9u9d0qsj2jx5m5p0lgneeg792tsux0260vdux0kw33y8sddlk0y`
*   **Explorer Link**: [View Transaction](https://explorer.provable.com/transaction/at1a85lw8g9u9d0qsj2jx5m5p0lgneeg792tsux0260vdux0kw33y8sddlk0y)
*   **Network**: Aleo Testnet

---

## 🛠️ Critical Fixes & Logic Refinements

### 1. 🪙 Credits Record Interaction
*   **Original**: Used `credits_in - setup_fee` (incorrect syntax).
*   **Fixed**: Integrated `credits.aleo/transfer_private`. In Aleo, credits are records that must be spent via specialized transitions. I properly handled the input record and the returned `(change, payment)` tuple.

### 2. ⚡ Proper Import & Linkage
*   **Original**: `import credit.leo;` (Non-existent/local file reference).
*   **Fixed**: Changed to `import credits.aleo;`, the official system program for credits. I also correctly used `credits.aleo/credits` as the record type.

### 3. 🛡️ Record Compliance
*   **Original**: Missing `owner: address` field in some record definitions.
*   **Fixed**: Every `record` in Leo requires an `owner` field of type `address`. Added this to `ProposalRecord`, `VoteRecord`, and `DaoSubscription` to ensure the ZK-circuit compiled correctly.

### 4. 🔄 Conditional Fee Logic
*   **Original**: Attempted to use `if` expressions for state assignment inside transitions.
*   **Fixed**: Implemented standard Leo logic for calculating subscription fees based on the number of proposals requested (Freemium: first 10 free, then paid).

---

## 📞 API Usage Guide

### 📱 Client-Side (Frontend Wallet Adapter)
Since `create_premium_dao` and `subscribe_to_dao` require **Private Credit Records** from the user's wallet, they **must** be called using a Wallet Adapter.

```typescript
const { requestTransaction } = useWallet();

const handleCreateDAO = async () => {
    // 1. Get a private credits record from the user's wallet
    // 2. Specify the setup_fee (minimum 5,000,000 microcredits = 5 ALEO)
    const inputs = [
        "name_field",
        "aleo1...", // token address
        "1000u64", // subscription fee
        "{CREDITS_RECORD_OBJECT}",
        "5000000u64"
    ];

    await requestTransaction({
        programId: "premium_voting_v1.aleo",
        functionName: "create_premium_dao",
        inputs: inputs,
        fee: 0.5
    });
};
```

### 🖥️ Server-Side (Proving API / Admin)
For calls that do not require private records (like `verify_vote` or public transitions), use the SDK:

```typescript
import { ProgramManager } from "@provablehq/sdk";

const result = await programManager.execute(
    "premium_voting_v1.aleo",
    "verify_vote",
    0.1, // Fee
    false,
    ["12345field", "12345field"]
);
```

---

## 📜 Function Overview
1.  **`create_premium_dao`**: Initializes a DAO record. Requires a 5 ALEO setup fee sent to the treasury.
2.  **`subscribe_to_dao`**: Issues a `DaoSubscription` record. First 10 proposals are free; subsequent ones require payment to the DAO owner.
3.  **`cast_vote`**: Generates a private `VoteRecord` for the user.
4.  **`verify_vote`**: A simple helper to compare a proof hash against an expected value.

---
*Developed by Jules - Automated Aleo Systems Engineer.*
