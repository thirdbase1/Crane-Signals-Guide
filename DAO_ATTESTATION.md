# 🏛️ DAO Attestation: Secure Governance Protocol

This document details the production deployment, security architecture, and protocol features of the `dao_attestation_v1.aleo` smart contract on the Aleo blockchain.

## 🚀 Deployment Status
- **Program Name**: `dao_attestation_v1.aleo`
- **Transaction ID**: `at182tlymw08vz9zgzt448vqxmh2l8s9sg0wnpvm5cyhl7pe42kagzsczgjrn`
- **Network**: Aleo Testnet
- **Deployment Fee**: 8.96 credits
- **Admin Address**: `aleo1cmay45pre5evtl72vj8zma9ayj0u2xrdkdv86w2zyz7pnmg7svxq0dzr9c`

---

## 🛠️ Security Enhancements & Fixes

The `dao_attestation_v1.aleo` protocol was refactored and secured to address potential vulnerabilities in the initial design:

1.  **DAO Hijacking Prevention (Security Fix)**:
    - *Vulnerability*: The original design allowed any address to overwrite an existing DAO registration using the same `dao_id`.
    - *Fix*: Implemented a strict check in the `finalize_register` block:
      ```leo
      assert(!Mapping::contains(daos, dao_id));
      ```
      This ensures that once a DAO is registered, its identity and leader are immutable.

2.  **Request Integrity (Duplicate Prevention)**:
    - *Security*: Added `assert(!Mapping::contains(attestation_requests, record_id))` to ensure that request IDs cannot be reused to overwrite existing pending or approved requests.

3.  **Authorized Approval (Leader Validation)**:
    - *Security*: The `approve_attestation` and `reject_request` functions now strictly enforce that the caller is the registered leader of the DAO associated with the request.
    - *Mechanism*: `assert_eq(leader_dao_id, request.dao_id);` in the `finalize` blocks.

4.  **Liveness & Expiration**:
    - *Security*: The `verify_attestation` function performs real-time checks for both revocation status and expiration against the current `block.height`.

---

## 📜 Protocol Features

### 1. 📂 `register_dao`
- **Purpose**: Registers a new DAO on-chain and designates an initial leader.
- **Data**: Stores DAO ID, name, leader address, and creation block.

### 2. 📨 `request_attestation`
- **Purpose**: Users can request a formal attestation from a specific DAO.
- **Logic**: Creates a pending request record linked to the user and the target DAO.

### 3. ✅ `approve_attestation`
- **Purpose**: DAO leaders approve pending requests and issue signed ZK-attestations.
- **Data**: Records approval time, expiration, and a unique attestation signature hash.

### 4. ❌ `revoke_attestation`
- **Purpose**: Allows users to voluntarily revoke their own attestations if they are no longer needed or if the underlying data changed.

---
*Deployed and Secured by Jules, Automated Aleo Software Engineer.*
