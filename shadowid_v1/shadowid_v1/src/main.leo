// ShadowID Identity Commitment Registry
// Aleo Leo Smart Contract v1.0
// This contract registers identity commitments on-chain for immutability
// and enables verification without revealing identity data.

program shadowid_v1.aleo {

    @noupgrade
    async constructor() {}

    // Identity commitment record stored on-chain (Private)
    record IdentityCommitment {
        owner: address,
        commitment_hash: field,
        timestamp: u64,
        is_revoked: bool,
    }

    // Public mapping of commitments for verification
    mapping commitments: field => address;
    mapping revocations: field => bool;
    mapping commitment_timestamps: field => u64;

    // Register a new identity commitment on-chain
    // Returns an IdentityCommitment record owned by the caller
    async transition register_commitment(
        public commitment_hash: field,
        public timestamp: u64
    ) -> (IdentityCommitment, Future) {
        // Create the commitment record
        let commitment_record: IdentityCommitment = IdentityCommitment {
            owner: self.caller,
            commitment_hash: commitment_hash,
            timestamp: timestamp,
            is_revoked: false,
        };

        return (commitment_record, finalize_register_commitment(commitment_hash, self.caller, timestamp));
    }

    async function finalize_register_commitment(
        public commitment_hash: field,
        public owner: address,
        public timestamp: u64
    ) {
        // SECURITY FIX: Prevent duplicate registration of the same commitment hash
        let exists: bool = Mapping::contains(commitments, commitment_hash);
        assert(!exists);

        // Store commitment in public mappings for discovery
        Mapping::set(commitments, commitment_hash, owner);
        Mapping::set(commitment_timestamps, commitment_hash, timestamp);
        Mapping::set(revocations, commitment_hash, false);
    }

    // Revoke an existing identity commitment
    // Only the owner can revoke their commitment (enforced by Record spending logic)
    async transition revoke_commitment(
        commitment: IdentityCommitment,
    ) -> (IdentityCommitment, Future) {
        // Security Check: Ensure the record being revoked isn't already revoked
        assert(!commitment.is_revoked);

        // Create revoked commitment record
        let revoked_commitment: IdentityCommitment = IdentityCommitment {
            owner: commitment.owner,
            commitment_hash: commitment.commitment_hash,
            timestamp: commitment.timestamp,
            is_revoked: true,
        };

        return (revoked_commitment, finalize_revoke_commitment(commitment.commitment_hash));
    }

    async function finalize_revoke_commitment(
        public commitment_hash: field
    ) {
        // Mark commitment as revoked in the global state
        Mapping::set(revocations, commitment_hash, true);
    }

    // Check if commitment is revoked
    // Fails if the commitment is revoked or doesn't exist
    async transition check_revocation(
        public commitment_hash: field
    ) -> Future {
        return finalize_check_revocation(commitment_hash);
    }

    async function finalize_check_revocation(
        public commitment_hash: field
    ) {
        // Check revocation status - will assert if revoked
        let revoked: bool = Mapping::get_or_use(revocations, commitment_hash, false);
        assert(!revoked);

        // Also ensure it actually exists
        let exists: bool = Mapping::contains(commitments, commitment_hash);
        assert(exists);
    }
}
