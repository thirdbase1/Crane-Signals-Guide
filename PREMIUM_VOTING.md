# 💎 Aleo Premium Voting: Technical Breakdown (premium_voting_v1_vibe_coding.aleo)

This document covers the "Freemium" DAO model implemented on Aleo.

---

## 🚀 Deployment Status
*   **Program ID**: `premium_voting_v1_vibe_coding.aleo`
*   **Checksum**: `[18u8, 238u8, 243u8, 202u8, 207u8, 185u8, 52u8, 227u8, 182u8, 198u8, 225u8, 209u8, 63u8, 43u8, 175u8, 4u8, 15u8, 189u8, 5u8, 191u8, 244u8, 218u8, 237u8, 236u8, 235u8, 249u8, 72u8, 142u8, 206u8, 231u8, 9u8, 37u8]`

---

## 🛠️ Feature Set
1.  **DAO Creation**: Paid creation (5 ALEO) with token configuration.
2.  **Tiered Subscriptions**:
    - **Free**: First 10 proposals are free (`subscribe_free`).
    - **Paid**: Subscriptions > 10 proposals require payment (`subscribe_to_dao`).
3.  **Private Records**: All subscription and vote records are encrypted for the owner.

---

## 📞 API Usage

```typescript
// Subscribe to a DAO (Paid tier)
await programManager.execute(
    "premium_voting_v1_vibe_coding.aleo",
    "subscribe_to_dao",
    0.5,
    false,
    [daoRecord, numProposals, creditsRecord]
);
```
