program qr_verifier.aleo {
    struct VerificationRecord {
        verifier: address,
        verified_at: u32,
        commitment_hash: field,
        is_valid: bool,
    }

    mapping verification_proofs: field => VerificationRecord;
    mapping verification_history: field => u32;

    @noupgrade
    async constructor() {}

    async transition verify_qr(
        public commitment_hash: field,
        public proof_id: field,
        public dummy: field
    ) -> (bool, Future) {
        return (true, finalize_verify_qr(commitment_hash, proof_id, self.caller));
    }

    async function finalize_verify_qr(
        public commitment_hash: field,
        public proof_id: field,
        public verifier: address
    ) {
        // SECURITY FIX: Prevent overwriting existing verification proofs
        assert(!Mapping::contains(verification_proofs, proof_id));

        let new_record: VerificationRecord = VerificationRecord {
            verifier: verifier,
            verified_at: block.height,
            commitment_hash: commitment_hash,
            is_valid: true,
        };
        Mapping::set(verification_proofs, proof_id, new_record);
    }

    async transition increment_count(
        public commitment_hash: field
    ) -> Future {
        return finalize_increment_count(commitment_hash);
    }

    async function finalize_increment_count(
        public commitment_hash: field
    ) {
        let current: u32 = Mapping::get_or_use(verification_history, commitment_hash, 0u32);
        Mapping::set(verification_history, commitment_hash, current + 1u32);
    }
}
