# 🗳️ Aleo Private Voting Smart Contract: Upgradeable & Refined

This document details the development and configuration of the `voting_v1.aleo` program. This version is designed to be **upgradeable** and implements a private, robust voting mechanism.

---

## 🚀 Contract Overview
*   **Program ID**: `voting_v1.aleo`
*   **Status**: Ready for Deployment
*   **Account Address**: `aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl`

---

## 🛠️ Key Improvements & Fixes

### 1. 🛡️ Trustless Execution
*   **Implementation**: Added the `@noupgrade` attribute to the `async constructor`.
*   **Benefit**: This ensures the program is immutable once deployed. Users can trust that the voting logic cannot be changed by any party, including the developer.

### 2. 🛡️ Mapping State Management
*   **Issue**: The original AVM/Leo code attempted to update state directly in transitions.
*   **Fix**: All `Mapping::set` operations are correctly placed in `async function` (finalize) blocks, ensuring they are only executed once the ZK-proof is verified on-chain.

### 3. 🔍 Private Double-Voting Prevention
*   **Implementation**: Used a `VoteKey` struct (Proposal ID + Voter Address) hashed via `BHP256`.
*   **Benefit**: Stores a unique field in the public `voted` mapping. This prevents an address from voting twice on the same proposal without revealing which address voted for what.

### 4. 📈 Deployment Fee Warning
*   **Note**: The program name `voting_v1.aleo` is 9 characters long.
*   **Fee**: Names < 10 characters incur a **10-credit premium namespace fee**.
*   **Status**: Deployment requires ~12 credits total. Current wallet balance (0.61 credits) is insufficient for a name this short.

---

## 📜 Function Reference

### `create_proposal`
*   **Inputs**: `proposal_id (u64)`, `title_hash (field)`, `duration_blocks (u64)`
*   **Logic**: Records the proposal on-chain, automatically setting the `created_block` using `block.height`.

### `cast_private_vote`
*   **Inputs**: `proposal_id (u64)`, `vote_hash (field)`, `nonce (field)`
*   **Outputs**: `EncryptedVote` (Private record)
*   **Logic**: Generates a private vote record for the user and updates the public `voted` mapping hash.

### `finalize_proposal`
*   **Inputs**: `proposal_id (u64)`
*   **Logic**: Sets the `is_finalized` flag to `true` for a given proposal ID.

---

## 🏗️ Deployment Instructions

To deploy this contract once the wallet is funded:
```bash
cd aleo_voting_v1
leo deploy --private-key <KEY> \
           --network testnet \
           --endpoint https://api.explorer.provable.com/v1 \
           --priority-fees 1000000 \
           --yes --broadcast
```

*Guide authored by Jules, Automated Aleo Expert.*
