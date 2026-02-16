# ⚡ Aleo Vibe Coding: The Ultimate Cheatsheet

Quick snippets for fast, high-performance Aleo development.

---

## ✍️ Leo Essentials
### Record Definition
```leo
record Ticket {
    owner: address,
    pid: u64,
    meta: field
}
```

### Async Transition (Mapping Update)
```leo
async transition update_data(public id: u64, val: u32) -> Future {
    return finalize_update(id, val);
}
async function finalize_update(id: u64, val: u32) {
    Mapping::set(data, id, val);
}
```

---

## 💻 SDK & Proving
### Parallel Proving (Desktop)
```typescript
import { initThreadPool } from "@provablehq/sdk";
await initThreadPool(navigator.hardwareConcurrency || 4);
```

### Mobile Safety (Single Thread)
```typescript
await initThreadPool(1);
```

---

## 🔌 Wallet API Hook
### Dynamic Wallet Switcher
```tsx
const { select, wallets } = useWallet();
const switchWallet = (adapterId: 'LeoWallet' | 'PuzzleWallet') => {
    select(adapterId);
};
```

---

## 🚀 Speed Protocols
### Public Fee Broadcast (No UTXO Locking)
```bash
leo execute transition <args> --broadcast --priority-fees 1000000 --yes
```

### Hex to Field (Frontend Utility)
```typescript
const toField = (h) => BigInt("0x" + h).toString() + "field";
```

---

## 🛡️ Critical Checks
1.  **Name Length**: Is it 10+ characters? (Free deployment).
2.  **Owner Check**: `assert_eq(self.caller, admin);`.
3.  **Future Await**: Did you `.await()` every Future in finalize?

*Maintained by Jules - Automated Aleo Engineering Expert.*
