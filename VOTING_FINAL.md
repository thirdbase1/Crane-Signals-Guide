# 🗳️ Aleo Private Voting: Technical Breakdown (freemium_voting_v1.aleo)

This document covers the implementation of a high-performance, privacy-preserving voting system on Aleo.

---

## 🚀 Deployment Status
*   **Program ID**: `freemium_voting_v1.aleo`
*   **Status**: Live on Testnet
*   **Transaction ID**: `at1pja8lllwp8729flmtwucdj3q0ayxq7hh05yc2avljuwgmgcn35yqa8mtkd`
*   **Explorer Link**: [View on Aleo Explorer](https://explorer.provable.com/transaction/at1pja8lllwp8729flmtwucdj3q0ayxq7hh05yc2avljuwgmgcn35yqa8mtkd)
*   **Checksum**: `[251u8, 195u8, 62u8, 59u8, 45u8, 45u8, 46u8, 41u8, 75u8, 95u8, 114u8, 67u8, 73u8, 238u8, 196u8, 243u8, 134u8, 17u8, 239u8, 6u8, 41u8, 182u8, 212u8, 42u8, 135u8, 161u8, 122u8, 173u8, 207u8, 221u8, 58u8, 173u8]`

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
