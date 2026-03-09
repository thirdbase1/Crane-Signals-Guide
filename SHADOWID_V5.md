# 👤 ShadowID Identity Protocol v5

This document details the deployment, architecture, and security properties of the `shadowid_v5.aleo` protocol.

## Deployment Details
*   **Program ID**: `shadowid_v5.aleo`
*   **Network**: Aleo Testnet
*   **Status**: Deployed
*   **Transaction ID**: `at1hv9tymzr3p3kq8nngqakt2tdzcwzh4v5pm00dtkql5r0n00ceq8qkwwws4`

## Overview
The `shadowid_v5.aleo` smart contract is a decentralized, zero-knowledge identity management system designed to support attribute verification, peer endorsements, and dispute governance. Users register a cryptographic commitment representing their identity along with hashed attribute vectors.

## Protocol Features

### 1. Zero-Knowledge Identity Commitments
*   Uses `commitments` mappings to bind a cryptographic field element to a block height timestamp.
*   Maps `attribute_hashes` to the identity to allow users to verify attributes using zero-knowledge proofs off-chain, checking against the on-chain hash.

### 2. Peer Attestation (Endorsements)
*   Identities can be endorsed by peers using `endorse_attribute`.
*   Includes reputation logic: successful endorsements increment a user's `shadow_score` dynamically on-chain up to a maximum credibility of 100.

### 3. Endorsement Disputes
*   Enables a governance layer where external addresses can submit `challenge_endorsement` transactions to flag false claims.
*   Once a dispute is created, the DAO/community can utilize the `vote_on_dispute` transition to govern the legitimacy of the attribute.

### 4. Custom Attribute Registration
*   Provides a registry (`register_custom_attribute`) to extend base attributes, binding unique text vectors to commitments.

## Security Fixes & Vulnerabilities Addressed

### Fixed Commitment Overwrite Vulnerability
*   **Issue**: Anyone could re-register over an existing `commitment` field, resetting the user's score to 50 and changing their attribute hashes.
*   **Fix**: Added `assert(exists == 0u64);` within `finalize_register_commit` to ensure identities are immutable once created.

### Struct-Based Compound Hashing
*   **Issue**: Previous Aleo 3.4.0 syntax limits inline `hash_to_field` functions to 1 or 2 variables, making it difficult to securely hash `target_commitment`, `attribute_id`, and `endorser_address` into a single dedup key without losing security constraints or causing compiler panics.
*   **Fix**: Introduced explicit structs (`EndorsementHash`, `DisputeHash`, `CustomAttrHash`, `VoteHash`) to neatly pack variables and pass them into `Poseidon8::hash_to_field`. This guarantees perfectly secure, multi-variable hashing natively.

### Prevented Non-Existent Dispute Voting
*   **Issue**: Users could vote on fake `dispute_key` elements that were never officially challenged.
*   **Fix**: Added `assert(Mapping::contains(disputes, dispute_key));` inside `finalize_vote_on_dispute`.

### Restricted Phantom Endorsement Challenges
*   **Issue**: A malicious user could challenge an endorsement that never occurred on-chain, creating fake governance noise.
*   **Fix**: `finalize_challenge_endorse` now strictly enforces `assert(Mapping::contains(endorsements, dedup_key));` to verify the attestation exists before a dispute can open.

*Guide authored by Jules, Automated Aleo Software Engineer.*
