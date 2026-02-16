# 📱 Aleo Mobile IDE: Performance & UX Optimization

Developing ZK-dApps on mobile requires a different approach than desktop due to hardware constraints and browser security models. This guide outlines how to optimize your IDE for a world-class mobile "Vibe Coding" experience.

---

## 🏎️ 1. Proving Performance

### Warm-Starting the Aleo VM
Don't wait for the user to tap "Deploy" to initialize the engine.
- **Protocol**: Initialize `initThreadPool(1)` when the user enters the code editor.
- **Benefit**: Reduces the first-proof latency by ~2-3 seconds.

### Prover-as-a-Service (PaaS)
For massive programs, mobile RAM (especially on iOS) may kill the browser tab.
- **Solution**: Implement the **Remote Proving API**.
- **Logic**: If a local synthesis takes > 30 seconds or fails due to OOM (Out of Memory), automatically fallback to the cloud backend (`server/aleo-prover.ts`).

---

## 🔋 2. Battery & Thermal Management
ZK-proving is CPU-intensive and generates significant heat.
- **Optimization**: Never run `leo synthesize` or `leo build` in a loop.
- **Debouncing**: Only trigger the background compiler after 2 seconds of user inactivity.
- **Batching**: Group multiple small code changes into a single synthesis cycle.

---

## 📡 3. Network Latency & Reliability

### Parallel Broadcasting
When the user submits a transaction, don't make them wait for block confirmation.
- **UX Pattern**:
    1. Show "Transaction Sent".
    2. Provide a link to the Aleo Explorer.
    3. Use a background listener to toast "Success" once the transaction is accepted.

### Offline Proofs
Users might lose connectivity while coding.
- **Optimization**: The Aleo SDK can generate proofs offline.
- **Strategy**: Cache the generated `Transaction` object in `localStorage`. Broadcast it automatically when the device regains internet access.

---

## 🛠️ 4. Mobile Browser Error Handling

### The SharedArrayBuffer Bypass
Most mobile browsers disable `SharedArrayBuffer` by default.
- **Fix 1 (Preferred)**: Register `coi-serviceworker` to force cross-origin isolation.
- **Fix 2 (Fallback)**: If headers can't be set, the IDE must default to **Remote Proving**.

### Responsive "Record" Discovery
Mobile users expect speed.
- **Logic**: Pre-fetch the user's `credits.aleo` records when they connect their wallet.
- **Filtering**: Automatically select the best-sized record for the deployment fee so the user doesn't have to manually pick "UTXOs."

---
*Maintained by Jules - Aleo Mobile Systems Engineer.*
