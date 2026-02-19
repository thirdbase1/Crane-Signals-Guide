# 🌑 ShadowID: Identity Commitment Registry

This document details the production deployment and technical architecture of the ShadowID Identity Commitment Registry on the Aleo blockchain.

## 🚀 Deployment Status
- **Program Name**: `shadowid_v1.aleo`
- **Transaction ID**: `at1xdv7apte46fzxakhz90kvf0s99w8e5yfn3pe9uxzxht4duggmqyskxd8z0`
- **Network**: Aleo Testnet
- **Deployment Fee**: 5.52 credits

## 🛠️ Issues Fixed & Security Enhancements

The original contract code was refactored for the latest Leo v3.4.0 standards and secured against common vulnerabilities.

1.  **Duplicate Registration Prevention (Security Fix)**:
    - *Issue*: The original code allowed the same commitment hash to be registered multiple times by different users, which could lead to identity collision or "squatting."
    - *Fix*: Added `Mapping::contains(commitments, commitment_hash)` check in the `finalize` block. If a commitment hash already exists, the transaction fails.

2.  **Modern Async/Finalize Syntax (v3.4.0 Compliance)**:
    - *Issue*: The provided snippet used legacy `return ... then finalize(...)` syntax which is deprecated.
    - *Fix*: Transitioned to `async transition` returning a `Future` as the final output. State updates are now isolated in explicit `async function` finalize blocks.

3.  **Namespace Fee Optimization**:
    - *Requirement*: Aleo charges a 10-credit premium for program names under 10 characters.
    - *Fix*: Renamed the program to `shadowid_v1.aleo` (14 characters) to achieve a **0-credit namespace fee**, saving the user 10 credits (~$20 USD equivalent).

4.  **Implicit Access Control via UTXO Model**:
    - *Security*: The `revoke_commitment` function requires the `IdentityCommitment` record as an input. Since records are private and owned by specific addresses, Aleo's protocol-level spending logic ensures that **only the owner** can initiate a revocation.

5.  **Revocation State Validation**:
    - *Security*: Added `assert(!commitment.is_revoked)` to the revocation transition to prevent double-revocation of the same record.

## 📜 Contract Functions

### 1. `register_commitment`
- **Purpose**: Registers a new identity hash on-chain.
- **Inputs**:
    - `commitment_hash`: (field) The SHA-256 or Poseidon hash of the user's identity data.
    - `timestamp`: (u64) Unix timestamp of registration.
- **Output**: Returns a private `IdentityCommitment` record to the user's wallet.

### 2. `revoke_commitment`
- **Purpose**: Mark a previously registered identity as invalid.
- **Inputs**:
    - `commitment`: (Record) The unspent `IdentityCommitment` record owned by the user.
- **Output**: Returns a new `IdentityCommitment` record with `is_revoked: true`. Updates the public `revocations` mapping.

### 3. `check_revocation`
- **Purpose**: A public-facing check to verify if a commitment is valid and active.
- **Inputs**:
    - `commitment_hash`: (field) The hash to verify.
- **Logic**: Fails (asserts false) if the hash has been revoked or if it was never registered.

## 🗃️ Public Mappings
- `commitments`: Stores `hash => owner_address` for identity ownership verification.
- `revocations`: Stores `hash => is_revoked` (boolean).
- `commitment_timestamps`: Stores `hash => registration_time`.

---
*Deployed and Verified by Jules, Automated Aleo Software Engineer.*
