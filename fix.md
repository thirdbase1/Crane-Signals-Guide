# 🛠️ Aleo Full-Stack Fixes: Issues & Corrective Methods

This document details the critical issues identified across the Aleo smart contract, frontend integration, and database layers, along with the implemented and recommended fixes.

---

## 1. 🛑 "Program Not Allowed" (Wallet Permissions)
**Problem**: Calling a contract function results in a "Program Not Allowed" error.
**Root Cause**: The DApp did not request explicit permission for the specific program ID during the initial wallet connection.
**Correct Method**: Include all interacting programs in the `connect` request.
```typescript
// Correct Connection Request
await wallet.connect("testnet", ["credits.aleo", "premium_voting_v3.aleo"]);
```

---

## 2. 🆔 TX ID Shows `shield_` instead of Blockchain Hash
**Problem**: The UI displays a temporary `shield_...` string instead of the actual Aleo transaction ID.
**Root Cause**: The `executeTransaction` call was returning an object with a `transitions` array rather than extracting the `transactionId` returned by the wallet.
**Correct Method**: Directly return and use the `transactionId` from the wallet response.
```typescript
const result = await walletExecuteTransaction({
  program: programId,
  function: functionName, // Ensure parameter name matches wallet API
  inputs: inputs,
  fee: fee,
});
return result.transactionId; // Use this directly in the UI
```

---

## 3. 🗄️ Database Not Saving Proposals (Supabase Schema Cache)
**Problem**: Inserting proposals into the database fails with "Could not find column" even though the column exists.
**Root Cause**: Supabase/PostgREST schema cache is stale or mismatched.
**Correct Method**:
1.  **Clear Cache**: Run a dummy query in the Supabase SQL editor to force a refresh.
2.  **Minimal Insert**: Use only the verified required fields to avoid schema mismatch errors.
```typescript
const { data, error } = await supabase
  .from('proposals')
  .insert({
    creator_address: creatorAddress,
    title: title,
    title_hash: txHash,
    voting_start_block: blockStart,
    voting_end_block: blockEnd
  });
```

---

## 4. 🔄 Auto-Convert Public to Private Failure
**Problem**: The "transfer_public_to_private" call fails with "Cannot read properties of undefined (reading '0')".
**Root Cause**: The `executeTransaction` utility expected a `transitions` array, but was passed a single flat object.
**Correct Method**: Wrap the transition parameters in the expected `transitions` array structure.
```typescript
const conversionResult = await executeTransaction({
  transitions: [{
    program: 'credits.aleo',
    functionName: 'transfer_public_to_private',
    inputs: [address, '6000000u64'],
  }],
  fee: 1_000_000,
  feePrivate: false,
});
```

---

## 5. ⏳ "Confirming on Blockchain" Hangs Forever
**Problem**: The UI stays stuck on "Confirming..." even after the transaction is broadcast.
**Root Cause**: Redundant polling of `transactionStatus` for transactions the wallet already confirmed.
**Correct Method**: Trust the immediate response from the wallet's `executeTransaction` call and update the UI status based on that result. Remove complex polling loops for initial broadcasting.

---

## 📜 Smart Contract Logic Fixes (`premium_voting_v3.aleo`)

The following vulnerabilities were identified in the initial AVM/Leo code and fixed in the production deployment:

### A. Double Voting Prevention
- **Old**: Users could vote multiple times as only the `proposal_id` was tracked.
- **Fix**: Implemented a `voted_proposals` mapping using a commitment: `BHP256::commit_to_field(voter, proposal_id)`.

### B. Expiration Enforcement
- **Old**: Votes were accepted even after the `end_block` because `finalize` didn't check height.
- **Fix**: Added `assert(block.height <= end_block)` in all vote finalize blocks.

### C. Proposal Overwrite Protection
- **Old**: Malicious actors could overwrite active proposals using the same `proposal_id`.
- **Fix**: Added `assert(!Mapping::contains(proposals, proposal_id))` in `create_proposal_for_dao`.

### D. Subscription Timing
- **Old**: Start block was hardcoded to `0u32`.
- **Fix**: Updated `subscribe_paid` to take a `start_block` input (verified on-chain) to properly calculate expiration.

---
*Verified and Documented by Jules, Aleo Software Engineer.*
