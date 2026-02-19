# 🌑 ShadowID Protocol

This document details the production deployment and technical architecture of the ShadowID ecosystem on the Aleo blockchain.

## 🚀 Deployment Status

### Core Registry
- **Program Name**: `shadowid_v1.aleo`
- **Transaction ID**: `at1xdv7apte46fzxakhz90kvf0s99w8e5yfn3pe9uxzxht4duggmqyskxd8z0`
- **Network**: Aleo Testnet
- **Features**: Identity Commitment Registry, Duplicate Prevention, Revocation Logic.

### Zero-Knowledge Identity System
- **Program Name**: `shadowid_v2.aleo`
- **Transaction ID**: `at1kqn24hdqxqq0u5nmu4xgq7usjy2lcv8e2ksdl5ufnfay5mde258q8rwa90`
- **Network**: Aleo Testnet
- **Features**: Selective Disclosure, Range Proofs, Membership Proofs.

---

## 🛠️ shadowid_v2 Technical Fixes & Enhancements

The `shadowid_v2` program implements advanced ZK primitives. During deployment, the following critical issues were resolved:

1.  **Block Height Restriction (Protocol Compliance)**:
    - *Issue*: `block.height` cannot be accessed within a `transition` block in snarkVM.
    - *Fix*: Refactored the code to pass `current_height` as a public input to the transition, which is then verified against `block.height` inside the `finalize` block. This ensures timing logic is cryptographically sound and protocol-compliant.

2.  **Cryptographic Type Alignment (BHP256)**:
    - *Issue*: The original code used `field` for the `salt`.
    - *Fix*: Corrected to `scalar` to match the `BHP256::commit_to_field` signature required for verifiable identity commitments.

3.  **Identifier Length Constraints**:
    - *Issue*: Function identifiers were too long (exceeding 31 bytes).
    - *Fix*: Shortened internal identifiers (e.g., `finalize_register_issuer`) to ensure successful compilation.

---

## 📜 shadowid_v2 Key Functions

### 1. `prove_range`
- **Purpose**: Prove that an attribute value (e.g., Age) is between a `min` and `max` bound.
- **Privacy**: The actual value is never revealed; only the proof of the range is verified against the signed commitment.

### 2. `prove_membership`
- **Purpose**: Prove that an attribute matches a specific required value.
- **Privacy**: Used for verifying specific permissions (e.g., "Country == USA") without revealing other attributes in the credential.

### 3. `prove_existence`
- **Purpose**: Prove that a user holds a valid credential signed by a registered issuer.
- **Privacy**: Uses `BHP256` commitments to link the credential to the user's identity without revealing the underlying data.

---
*Deployed and Verified by Jules, Automated Aleo Software Engineer.*
