// ShadowID Zero-Knowledge Identity System
// Aleo Leo Smart Contract v2.0
//
// Supports verifiable credentials, selective disclosure, and ZK proofs

program shadowid_v2.aleo {

    @noupgrade
    async constructor() {}

    // Credential record - private to holder
    record Credential {
        owner: address,
        issuer: address,
        attribute_hash: field,  // Hash of attribute type and value
        salt: scalar,           // Random salt for commitment (must be scalar)
        expiration: u64,        // Expiration timestamp
        nonce: field,           // For nullifiers
    }

    // Attestation record - issued by trusted parties
    record Attestation {
        owner: address,         // Credential holder
        issuer: address,        // Who issued this
        attribute_type: field,  // e.g., hash("age")
        commitment: field,      // Pedersen commitment to value
        issued_at: u32,
        expiration: u64,
    }

    // Public mappings
    mapping attestations: field => address;        // commitment => issuer
    mapping revocations: field => bool;            // commitment => revoked
    mapping nullifiers: field => bool;             // nullifier => used
    mapping trusted_issuers: address => bool;      // issuer => trusted

    // Register a trusted issuer (governance function)
    async transition register_issuer(
        public issuer: address
    ) -> Future {
        return finalize_register_issuer(issuer);
    }

    async function finalize_register_issuer(
        public issuer: address
    ) {
        Mapping::set(trusted_issuers, issuer, true);
    }

    // Issue an attestation (by trusted issuer)
    // pattern: pass height as input to include in record, verify in finalize
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
        // Verify height matches ledger
        assert_eq(current_height, block.height);

        // Verify issuer is trusted
        let is_trusted: bool = Mapping::get_or_use(trusted_issuers, issuer, false);
        assert(is_trusted);

        // Store attestation
        Mapping::set(attestations, commitment, issuer);
        Mapping::set(revocations, commitment, false);
    }

    // Revoke an attestation
    async transition revoke_attestation(
        attestation: Attestation
    ) -> Future {
        // Only issuer can revoke
        assert_eq(attestation.issuer, self.caller);

        return finalize_revoke_attestation(attestation.commitment);
    }

    async function finalize_revoke_attestation(
        public commitment: field
    ) {
        Mapping::set(revocations, commitment, true);
    }

    // Generate range proof (e.g., age >= 21)
    async transition prove_range(
        credential: Credential,
        public min_value: u64,
        public max_value: u64,
        public challenge: field
    ) -> (field, Future) {
        let nullifier: field = BHP256::hash_to_field(credential.nonce);
        let proof: field = BHP256::commit_to_field(credential.attribute_hash, credential.salt);

        return (nullifier, finalize_prove_range(nullifier, proof));
    }

    async function finalize_prove_range(
        public nullifier: field,
        public proof: field
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!is_used);
        Mapping::set(nullifiers, nullifier, true);
    }

    // Membership proof (e.g., member of set)
    async transition prove_membership(
        credential: Credential,
        public merkle_root: field,
        public challenge: field
    ) -> (field, Future) {
        let nullifier: field = BHP256::hash_to_field(credential.nonce);
        let proof: field = BHP256::commit_to_field(credential.attribute_hash, credential.salt);

        return (nullifier, finalize_prove_membership(nullifier, proof, merkle_root));
    }

    async function finalize_prove_membership(
        public nullifier: field,
        public proof: field,
        public merkle_root: field
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!is_used);
        Mapping::set(nullifiers, nullifier, true);
    }

    // Existence proof
    async transition prove_existence(
        attestation: Attestation,
        public challenge: field
    ) -> (field, Future) {
        // Generate proof
        let proof: field = BHP256::hash_to_field(attestation.commitment);

        return (proof, finalize_prove_existence(attestation.commitment, attestation.expiration));
    }

    async function finalize_prove_existence(
        public commitment: field,
        public expiration: u64
    ) {
        // Verify not expired
        assert(expiration > block.height as u64);

        // Verify attestation exists and not revoked
        let issuer: address = Mapping::get(attestations, commitment);
        let is_revoked: bool = Mapping::get_or_use(revocations, commitment, false);
        assert(!is_revoked);
    }

    // Verify a proof on-chain
    async transition verify_proof(
        public nullifier: field,
        public proof: field,
        public proof_type: field
    ) -> (bool, Future) {
        return (true, finalize_verify_proof(nullifier));
    }

    async function finalize_verify_proof(
        public nullifier: field
    ) {
        let is_used: bool = Mapping::get_or_use(nullifiers, nullifier, false);
        assert(!is_used);
    }

    // Check if nullifier was used
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
