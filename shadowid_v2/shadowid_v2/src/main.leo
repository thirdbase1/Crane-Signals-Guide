// ShadowID v3: Secure Identity Protocol
// Refactored and Secured by Jules

program shadowid_v3.aleo {

    @noupgrade
    async constructor() {}

    record Credential {
        owner: address,
        issuer: address,
        attribute_hash: field,
        salt: scalar,
        expiration: u64,
        nonce: field,
    }

    record Attestation {
        owner: address,
        issuer: address,
        attribute_type: field,
        commitment: field,
        issued_at: u32,
        expiration: u64,
    }

    mapping attestations: field => address;
    mapping revocations: field => bool;
    mapping nullifiers: field => bool;
    mapping trusted_issuers: address => bool;

    // SECURITY FIX: Only the authorized admin can register issuers
    // Admin: aleo1cmay45pre5evtl72vj8zma9ayj0u2xrdkdv86w2zyz7pnmg7svxq0dzr9c
    async transition register_issuer(
        public issuer: address
    ) -> Future {
        // Enforce admin check in transition for immediate feedback
        assert_eq(self.caller, aleo1cmay45pre5evtl72vj8zma9ayj0u2xrdkdv86w2zyz7pnmg7svxq0dzr9c);
        return finalize_register_issuer(issuer);
    }

    async function finalize_register_issuer(
        public issuer: address
    ) {
        Mapping::set(trusted_issuers, issuer, true);
    }

    async transition issue_attestation(
        public holder: address,
        public attribute_type: field,
        public commitment: field,
        public expiration: u64,
        public current_height: u32
    ) -> (Attestation, Future) {
        let attestation: Attestation = Attestation {
            owner: holder,
            issuer: self.caller,
            attribute_type: attribute_type,
            commitment: commitment,
            issued_at: current_height,
            expiration: expiration,
        };
        return (attestation, finalize_issue_attestation(commitment, self.caller, current_height));
    }

    async function finalize_issue_attestation(
        public commitment: field,
        public issuer: address,
        public current_height: u32
    ) {
        assert_eq(current_height, block.height);
        let is_trusted: bool = Mapping::get_or_use(trusted_issuers, issuer, false);
        assert(is_trusted);
        Mapping::set(attestations, commitment, issuer);
        Mapping::set(revocations, commitment, false);
    }

    async transition revoke_attestation(
        attestation: Attestation
    ) -> Future {
        assert_eq(attestation.issuer, self.caller);
        return finalize_revoke_attestation(attestation.commitment);
    }

    async function finalize_revoke_attestation(
        public commitment: field
    ) {
        Mapping::set(revocations, commitment, true);
    }

    async transition prove_range(
        credential: Credential,
        public min_value: u64,
        public max_value: u64,
        public challenge: field
    ) -> (field, Future) {
        let nullifier: field = BHP256::hash_to_field(credential.nonce);
        let commitment: field = BHP256::commit_to_field(credential.attribute_hash, credential.salt);

        // SECURITY FIX: Link proof to on-chain commitment and expiration
        return (nullifier, finalize_prove_range(nullifier, commitment, credential.expiration));
    }

    async function finalize_prove_range(
        public nullifier: field,
        public commitment: field,
        public expiration: u64
    ) {
        // 1. Verify not used (Replay protection)
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!is_used);

        // 2. Verify on-chain existence (Existence verification)
        let issuer: address = Mapping::get(attestations, commitment);

        // 3. Verify not revoked (Revocation check)
        let is_revoked: bool = Mapping::get_or_use(revocations, commitment, false);
        assert(!is_revoked);

        // 4. Verify expiration (Liveness check)
        assert(expiration > block.height as u64);

        Mapping::set(nullifiers, nullifier, true);
    }

    async transition prove_membership(
        credential: Credential,
        public target_value: field,
        public challenge: field
    ) -> (field, Future) {
        let nullifier: field = BHP256::hash_to_field(credential.nonce);
        let commitment: field = BHP256::commit_to_field(credential.attribute_hash, credential.salt);

        return (nullifier, finalize_prove_membership(nullifier, commitment, credential.expiration));
    }

    async function finalize_prove_membership(
        public nullifier: field,
        public commitment: field,
        public expiration: u64
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!is_used);

        // SECURITY FIX: Same verification logic as prove_range
        let issuer: address = Mapping::get(attestations, commitment);
        let is_revoked: bool = Mapping::get_or_use(revocations, commitment, false);
        assert(!is_revoked);
        assert(expiration > block.height as u64);

        Mapping::set(nullifiers, nullifier, true);
    }

    async transition prove_existence(
        attestation: Attestation,
        public challenge: field
    ) -> (field, Future) {
        let proof_id: field = BHP256::hash_to_field(attestation.commitment);
        return (proof_id, finalize_prove_existence(attestation.commitment, attestation.expiration));
    }

    async function finalize_prove_existence(
        public commitment: field,
        public expiration: u64
    ) {
        assert(expiration > block.height as u64);
        let issuer: address = Mapping::get(attestations, commitment);
        let is_revoked: bool = Mapping::get_or_use(revocations, commitment, false);
        assert(!is_revoked);
    }

    async transition verify_proof(
        public nullifier: field,
        public challenge: field
    ) -> (bool, Future) {
        return (true, finalize_verify_proof(nullifier));
    }

    async function finalize_verify_proof(
        public nullifier: field
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(is_used); // Returns true if nullifier exists (proof was validly submitted)
    }

    async transition check_nullifier(
        public nullifier: field
    ) -> Future {
        return finalize_check_nullifier(nullifier);
    }

    async function finalize_check_nullifier(
        public nullifier: field
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(is_used);
    }
}
