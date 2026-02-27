# 📜 Credential Registry: Secure Commitment Protocol

This document details the production deployment, security architecture, and protocol features of the `credential_registry.aleo` smart contract on the Aleo blockchain.

## 🚀 Deployment Status
- **Program Name**: `credential_registry.aleo`
- **Transaction ID**: `at13hpjnt63fkp6d87ta4mlhzvmhlfjy9p3acltys08r6kl2n5zpgfqvsdycz`
- **Network**: Aleo Testnet
- **Deployment Fee**: 5.31 credits
- **Admin Address**: `aleo1cmay45pre5evtl72vj8zma9ayj0u2xrdkdv86w2zyz7pnmg7svxq0dzr9c`

---

## 🛠️ Security Enhancements & Fixes

The `credential_registry.aleo` protocol was refactored and secured to address potential vulnerabilities in the initial design:

1.  **Duplicate Registration Prevention (Security Fix)**:
    - *Vulnerability*: The original assembly allowed any address to overwrite an existing credential commitment, potentially hijacking or corrupting another user's identity data.
    - *Fix*: Implemented a strict check in the `finalize_register_commitment` block:
      ```leo
      assert(!Mapping::contains(credential_commitments, commitment));
      ```
      This ensures that once a commitment is registered, it cannot be overwritten.

2.  **Holder Validation (Access Control)**:
    - *Security*: The `revoke_credential` function enforces that only the original holder who registered the commitment can mark it as inactive.
    - *Mechanism*: `assert_eq(data.holder, caller);` in the `finalize` block.

3.  **Active-Only Verification**:
    - *Security*: The `verify_commitment` function only succeeds if the credential has not been revoked (`is_active: true`).

4.  **Namespace Optimization**:
    - *Optimization*: The program name `credential_registry.aleo` (19 characters) was chosen to avoid the 10-credit premium fee associated with short names (under 10 characters), saving the user significantly on deployment costs.

---

## 📜 Protocol Features

### 1. ✍️ `register_commitment`
- **Purpose**: Registers a new credential commitment on-chain.
- **Inputs**:
    - `commitment`: (field) The cryptographic hash of the credential.
    - `count`: (u8) The number of attributes included in the credential.
- **Data**: Stores the holder's address and the block height of registration.

### 2. 🚫 `revoke_credential`
- **Purpose**: Mark a previously registered credential as invalid.
- **Inputs**:
    - `commitment`: (field) The commitment hash to revoke.
- **Logic**: Can only be called by the holder.

### 3. ✅ `verify_commitment`
- **Purpose**: Publicly verify that a credential commitment is active and valid on the blockchain.
- **Inputs**:
    - `commitment`: (field) The hash to verify.

---
*Deployed and Secured by Jules, Automated Aleo Software Engineer.*
