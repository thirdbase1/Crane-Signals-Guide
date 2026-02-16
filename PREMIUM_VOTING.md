# 💎 Aleo Premium Voting: Technical Breakdown (premium_voting_v2.aleo)

This document covers the high-performance DAO governance model on Aleo.

---

## 🚀 Deployment Info
*   **Program ID**: `premium_voting_v2.aleo`
*   **Version**: 2.0 (Mapping Optimized)
*   **Checksum**: `[96u8, 137u8, 95u8, 58u8, 124u8, 13u8, 204u8, 142u8, 249u8, 104u8, 26u8, 158u8, 175u8, 65u8, 11u8, 153u8, 245u8, 187u8, 151u8, 27u8, 114u8, 3u8, 178u8, 110u8, 52u8, 205u8, 167u8, 191u8, 49u8, 244u8, 244u8, 78u8]`

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
