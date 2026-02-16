# 🗳️ Aleo Private Voting: Technical Breakdown (freemium_voting_v1.aleo)

This document covers the implementation of a high-performance, privacy-preserving voting system on Aleo.

---

## 🚀 Deployment Info
*   **Program ID**: `freemium_voting_v1.aleo`
*   **Version**: 1.0
*   **Checksum**: `[27u8, 72u8, 25u8, 32u8, 201u8, 76u8, 182u8, 96u8, 165u8, 23u8, 106u8, 191u8, 17u8, 42u8, 238u8, 240u8, 132u8, 206u8, 55u8, 241u8, 198u8, 75u8, 72u8, 191u8, 205u8, 205u8, 226u8, 47u8, 234u8, 249u8, 17u8, 152u8]`

---

## 🛠️ Feature Set
1.  **Lifetime Free Vote**: Every address gets exactly one free vote across the entire platform life.
2.  **Paid Subsequent Votes**: After the free vote is consumed, each vote costs 0.1 ALEO.
3.  **Double-Vote Prevention**: Uses an on-chain mapping of hashed `VoteKey` (Proposal ID + Voter Address).
4.  **Access Control**: Strictly enforced creator-only proposal finalization.

---

## 📞 API Usage

```typescript
// Cast a free vote
await programManager.execute("freemium_voting_v1.aleo", "cast_vote_free", 0.1, false, [proposalId, voteHash, nonce]);

// Cast a paid vote
await programManager.execute("freemium_voting_v1.aleo", "cast_vote_paid", 0.1, false, [proposalId, voteHash, nonce, creditsRecord]);
```
