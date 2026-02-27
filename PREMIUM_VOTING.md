# 💎 Aleo Premium Voting: Technical Breakdown (premium_voting_v2.aleo)

This document covers the high-performance DAO governance model on Aleo.

---

## 🚀 Deployment Status
*   **Program ID**: `premium_voting_v2.aleo`
*   **Status**: Live on Testnet
*   **Transaction ID**: `at1g22p4g0zkpjj8cptx9764h64xxue95zn5a57j2d3dletugcm7crq6s6g0q`
*   **Explorer Link**: [View on Aleo Explorer](https://explorer.provable.com/transaction/at1g22p4g0zkpjj8cptx9764h64xxue95zn5a57j2d3dletugcm7crq6s6g0q)
*   **Checksum**: `[21u8, 182u8, 75u8, 160u8, 91u8, 58u8, 192u8, 82u8, 128u8, 73u8, 112u8, 68u8, 235u8, 160u8, 61u8, 6u8, 42u8, 233u8, 139u8, 206u8, 152u8, 90u8, 232u8, 211u8, 172u8, 140u8, 250u8, 249u8, 79u8, 72u8, 6u8, 230u8]`

---

## 🛠️ Feature Set
1.  **Platform Registry**: DAOs are registered in a public mapping (`daos`) for shared discoverability.
2.  **DAO Proposal Creation**: Registered DAO owners can create official proposals.
3.  **Subscription Tiers**:
    - **Free Trial**: One-time 1000 block trial subscription.
    - **Paid Duration**: User-defined duration with automated fee calculation.
4.  **Scalable State**: Uses public mappings for shared data and private records for user credentials.

---

## 📞 API Usage

```typescript
// Register a DAO (5 ALEO Platform Fee)
await programManager.execute("premium_voting_v2.aleo", "create_premium_dao", 1.5, false, [name, tokenAddr, subFee, creditsRecord]);

// Subscribe to a DAO (Paid)
await programManager.execute("premium_voting_v2.aleo", "subscribe_paid", 0.5, false, [daoOwnerAddr, duration, fee, creditsRecord]);
```
