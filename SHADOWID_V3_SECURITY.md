# 🌑 ShadowID v3: Secure Identity Protocol

This document details the production deployment, security architecture, and zero-knowledge features of the ShadowID v3 protocol on the Aleo blockchain.

## 🚀 Deployment Status
- **Program Name**: `shadowid_v3.aleo`
- **Transaction ID**: `at1f5smjrgw9nzluhxzpt23pq47ne4nlnjngfal38mkn0x5e5n0wyzq5dycfl`
- **Network**: Aleo Testnet
- **Deployment Fee**: 10.85 credits
- **Admin Address**: `aleo1cmay45pre5evtl72vj8zma9ayj0u2xrdkdv86w2zyz7pnmg7svxq0dzr9c`

---

## 🛠️ Security Enhancements & Fixes

The ShadowID v3 protocol was refactored from the v2 base to address several critical security vulnerabilities:

1.  **Strict Access Control (Issuer Registry)**:
    - *Vulnerability*: In v2, any address could call `register_issuer` and mark themselves as trusted.
    - *Fix*: Implemented an Admin-only restriction. Only the deployer address (the authorized admin) can register new trusted issuers.

2.  **Commitment Integrity Verification**:
    - *Vulnerability*: The original `prove_range` and `prove_membership` functions only consumed a nullifier but did not verify if the credential commitment actually existed on-chain.
    - *Fix*: Added mandatory `Mapping::get(attestations, commitment)` checks in the finalize blocks. This ensures that a user cannot generate a proof for a non-existent or fabricated credential.

3.  **Liveness & Revocation Enforcement**:
    - *Enhancement*: Integrated `block.height` validation into the proof finalization logic. All proofs now check that the credential has not expired and has not been revoked by the issuer.

4.  **Cryptographic Replay Protection**:
    - *Mechanism*: Utilizes `BHP256` hashing to generate unique nullifiers from the credential's private nonce. Once a proof is submitted, the nullifier is stored on-chain to prevent replay attacks.

---

## 📜 Protocol Features

### 1. 🔍 Selective Disclosure (Range Proofs)
- **Function**: `prove_range`
- **Capability**: Prove that a private attribute (e.g., Age) is within a specific range `[min, max]` without revealing the actual value.
- **Security**: The proof is cryptographically linked to the on-chain attestation and checked for revocation in real-time.

### 2. 🧩 Membership Verification
- **Function**: `prove_membership`
- **Capability**: Prove that a private attribute matches a target value (e.g., "Country == USA") while keeping other attributes hidden.

### 3. 📜 Public Existence Proofs
- **Function**: `prove_existence`
- **Capability**: Allow a third party to verify that a user holds a valid, active credential from a trusted issuer without revealing any sensitive contents.

### 4. 🔗 Trust Hierarchy
- **Governance**: Only entities vetted by the admin can issue credentials. This prevents the protocol from being flooded with low-quality or malicious attestations.

---
*Deployed and Secured by Jules, Automated Aleo Software Engineer.*
