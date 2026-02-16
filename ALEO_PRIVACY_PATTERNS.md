# 🔒 Aleo Privacy Patterns: The Developer's Handbook

Aleo's core strength is its ability to handle private data while ensuring public integrity. This document outlines the most effective patterns for implementing privacy in your Leo programs.

---

## 1. The Nullifier Pattern (Private State Updates)

Since Aleo transitions are private, you cannot directly update a "shared" private state without revealing who is updating it. The **Nullifier Pattern** allows you to "spend" or "consume" a private record exactly once.

### How it Works:
1.  **Generation**: When a user creates a private record, they derive a unique `nullifier` from it (usually a hash of the record's serial number and a private secret).
2.  **Storage**: On-chain, you maintain a `mapping(field => bool)` of spent nullifiers.
3.  **Assertion**: When a user wants to use that record again, the program generates the nullifier and checks if it already exists in the mapping.

### Leo Implementation:
```leo
program privacy_vault.aleo {
    mapping nullifiers: field => bool;

    record Note {
        owner: address,
        amount: u64,
        salt: field,
    }

    async transition spend_note(note: Note) -> Future {
        // 1. Generate a nullifier (simplified)
        let nullifier: field = BHP256::hash_to_field(note.salt);

        return finalize_spend_note(nullifier);
    }

    async function finalize_spend_note(nullifier: field) {
        // 2. Ensure it hasn't been spent
        assert(!Mapping::contains(nullifiers, nullifier));
        // 3. Mark as spent
        Mapping::set(nullifiers, nullifier, true);
    }
}
```

---

## 2. Stealth Addresses (Identity Privacy)

Stealth addresses allow a sender to generate a one-time destination address for a recipient. Only the recipient can calculate the private key for that address.

### The Math (Elliptic Curve):
- Recipient has public key `A = a * G`.
- Sender picks random `r`, computes `P = H(r * A) * G + A`.
- Recipient computes `a' = H(r * A) + a`. Then `a' * G = P`.

### Usage in Aleo:
Senders can pass a `group` point (ephemeral public key) into a transition to notify the recipient without revealing their identity to the public.

---

## 3. Commit-Reveal (Secret Bidding / Voting)

Used when you need to prove you knew a piece of information at a certain time without revealing the information itself until a later stage.

### Stages:
1.  **Commitment**: User hashes their choice (e.g., a vote) with a random salt: `commitment = Hash(vote, salt)`. They submit this hash to the blockchain.
2.  **Reveal**: Later, the user provides the `vote` and `salt`. The program verifies: `assert(Hash(vote, salt) == stored_commitment)`.

---

## 4. Shielded Transfers (Record Sharding)

Instead of a single "Account Balance" (which is easy to track), Aleo uses a **Record Model** (UTXO-like).

### Pattern:
- **Splitting**: If you have a 100-credit record, you can split it into two 50-credit records.
- **Joining**: You can merge two small records into one large one.
- **Why?**: Sharding your balance across multiple records makes it significantly harder for chain-analysis tools to link your transactions.

---

## 5. View Keys (Selective Disclosure)

Aleo accounts have a **View Key** that is separate from the **Private Key**.

- **Private Key**: Needed to sign transactions and spend funds.
- **View Key**: Needed to decrypt records and see transaction history.
- **Auditability**: You can share your View Key with a regulator or auditor to prove compliance without giving them control over your funds.

---

## 6. Private Metadata (Encrypted Structs)

Even if a struct is passed into a transition, you can keep its contents private by encrypting it off-chain and passing the ciphertext as a `field` or `u128` array.

```leo
struct EncryptedData {
    data1: u128,
    data2: u128,
}
```
Only the owner of the decryption key can see the contents, while the blockchain only sees the `u128` values.

---

## 7. The "Anchor" Pattern (Cross-Chain/Off-Chain Verification)

You can store a `field` (Merkle Root) on-chain that represents a large set of off-chain data.
- Users can then provide a **Merkle Proof** inside a Leo transition to prove they belong to a whitelist or have a certain attribute without revealing the entire dataset.

---
*Documenting these patterns ensures that every Aleo developer can build with privacy-first principles from day one.*
