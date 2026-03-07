# 🗳️ Premium Voting v6 Smart Contract

This document details the deployment, features, and security fixes for the `premium_voting_v6.aleo` smart contract.

## Deployment Details
*   **Program ID**: `premium_voting_v6.aleo`
*   **Network**: Aleo Testnet
*   **Status**: Active

## Overview
The `premium_voting_v6.aleo` is the latest iteration of the premium voting protocol on the Aleo blockchain. This version improves upon previous iterations by deeply integrating zero-knowledge capabilities for completely anonymous and secure governance.

## Features

### 1. Anonymous Voting Tickets
*   Uses `VotingTicket` records to issue one-time voting passes.
*   Tickets contain the proposal ID, an encrypted ticket ID, and the owner, ensuring each ticket can only be used once without revealing voter identity.

### 2. Encrypted Tallying (Homomorphic)
*   The vote tallies for `yes`, `no`, and `abstain` are stored as encrypted fields (`encrypted_yes_votes`, `encrypted_no_votes`, `encrypted_abstain_votes`).
*   Instead of incrementing integers directly (which exposes vote volume), the protocol uses additive homomorphic encryption patterns (adding the `encrypted_vote` field) during tally updates in the `finalize` blocks.

### 3. DAO Subscriptions
*   Organizations must pay an entry fee (using `credits.aleo`) via `subscribe_paid` to participate.
*   Subscriptions have defined `start_block` and `end_block` constraints, making memberships valid only for specific block durations.

### 4. Comprehensive Vote Receipts
*   Generates a `VoteReceipt` record containing the `vote_commitment`, giving users an audit trail to verify their vote was counted without revealing the choice to the public.

### 5. Emergency Governance Controls
*   Provides DAO owners with the ability to pause the DAO globally using `emergency_pause`.

## Security Fixes & Vulnerabilities Addressed

### Fixed Proposal Overwrite Vulnerability
*   **Issue**: In older versions, anyone could potentially call the `finalize_create_proposal` block and overwrite an active proposal if they guessed the ID.
*   **Fix**: Added `contains proposals[r0] into r5; not r5 into r6; assert.eq r6 true;` inside `finalize create_proposal`. This ensures proposals can never be overwritten once created.

### Fixed Double-Voting via Commitments
*   **Issue**: Replay attacks where the same user could submit the same vote transaction multiple times.
*   **Fix**: Introduced `vote_commitments` mapping in the `vote_encrypted_yes`, `vote_encrypted_no`, and `vote_encrypted_abstain` blocks. The code asserts that the `vote_commitment` has not been seen before: `contains vote_commitments[r2] into r5; not r5 into r6; assert.eq r6 true;`.

### Fixed Ticket Reuse
*   **Issue**: Voting tickets could be reused for different proposals.
*   **Fix**: Ensured ticket tracking in the `finalize issue_voting_ticket` block by marking `ticket_used` true and enforcing uniqueness.

### Liveness Checks
*   Added `block.height` validation for proposal expirations and subscriptions.

*Guide authored by Jules, Automated Aleo Software Engineer.*
