program shadowid_v5.aleo {

    mapping commitments: field => u64;
    mapping attribute_hashes: field => field;
    mapping endorsements: field => bool;
    mapping shadow_scores: field => u64;
    mapping endorsement_counts: field => u64;
    mapping endorsement_timestamps: field => u64;
    mapping custom_attributes: field => field;
    mapping disputes: field => bool;

    // governance votes (dispute_key -> (yes_votes, no_votes)) using two mappings to prevent struct bloat
    mapping governance_votes_yes: field => u64;
    mapping governance_votes_no: field => u64;
    mapping casted_votes: field => bool;

    // Structs for clean hashing
    struct EndorsementHash {
        endorser: address,
        target: field,
        attr_id: u32
    }

    struct DisputeHash {
        dedup_key: field,
        challenger: address
    }

    struct CustomAttrHash {
        target: field,
        attr_name: field
    }

    struct VoteHash {
        dispute_key: field,
        voter: address
    }

    @custom
    async constructor() {
        assert_eq(true, true);
    }

    async transition register_commitment(
        commitment: field,
        attribute_hash: field
    ) -> Future {
        return finalize_register_commit(commitment, attribute_hash);
    }

    async function finalize_register_commit(commitment: field, attribute_hash: field) {
        let exists: u64 = Mapping::get_or_use(commitments, commitment, 0u64);
        assert(exists == 0u64);

        Mapping::set(commitments, commitment, block.height as u64);
        Mapping::set(attribute_hashes, commitment, attribute_hash);
        Mapping::set(shadow_scores, commitment, 50u64);
        Mapping::set(endorsement_counts, commitment, 0u64);
    }

    async transition verify_commitment(commitment: field) -> (bool, Future) {
        return (true, finalize_verify_commitment(commitment));
    }

    async function finalize_verify_commitment(commitment: field) {
        let registered: u64 = Mapping::get_or_use(commitments, commitment, 0u64);
        assert(registered > 0u64);
    }

    async transition verify_attribute_hash(
        commitment: field,
        expected_hash: field
    ) -> (bool, Future) {
        return (true, finalize_verify_attribute_hash(commitment, expected_hash));
    }

    async function finalize_verify_attribute_hash(commitment: field, expected_hash: field) {
        let stored_hash: field = Mapping::get_or_use(attribute_hashes, commitment, 0field);
        assert(stored_hash == expected_hash);
    }

    async transition endorse_attribute(
        target_commitment: field,
        attribute_id: u32,
        endorser_address: address
    ) -> Future {
        let hash_input: EndorsementHash = EndorsementHash {
            endorser: endorser_address,
            target: target_commitment,
            attr_id: attribute_id
        };
        let dedup_key: field = Poseidon8::hash_to_field(hash_input);

        return finalize_endorse_attribute(target_commitment, dedup_key);
    }

    async function finalize_endorse_attribute(
        target_commitment: field,
        dedup_key: field
    ) {
        let registered: u64 = Mapping::get_or_use(commitments, target_commitment, 0u64);
        assert(registered > 0u64);

        let already_endorsed: bool = Mapping::contains(endorsements, dedup_key);
        assert(!already_endorsed);

        Mapping::set(endorsements, dedup_key, true);
        Mapping::set(endorsement_timestamps, dedup_key, block.height as u64);

        let current_count: u64 = Mapping::get_or_use(endorsement_counts, target_commitment, 0u64);
        Mapping::set(endorsement_counts, target_commitment, current_count + 1u64);

        let current_score: u64 = Mapping::get_or_use(shadow_scores, target_commitment, 50u64);
        let new_score: u64 = current_score + 5u64;
        let final_score: u64 = new_score > 100u64 ? 100u64 : new_score;
        Mapping::set(shadow_scores, target_commitment, final_score);
    }

    async transition challenge_endorsement(
        target_commitment: field,
        endorser_address: address,
        attribute_id: u32,
        challenger_address: address
    ) -> Future {
        let hash_input: EndorsementHash = EndorsementHash {
            endorser: endorser_address,
            target: target_commitment,
            attr_id: attribute_id
        };
        let dedup_key: field = Poseidon8::hash_to_field(hash_input);

        let dispute_input: DisputeHash = DisputeHash {
            dedup_key: dedup_key,
            challenger: challenger_address
        };
        let dispute_key: field = Poseidon8::hash_to_field(dispute_input);

        return finalize_challenge_endorse(dispute_key, dedup_key);
    }

    async function finalize_challenge_endorse(dispute_key: field, dedup_key: field) {
        assert(Mapping::contains(endorsements, dedup_key));
        assert(!Mapping::contains(disputes, dispute_key));
        Mapping::set(disputes, dispute_key, true);
    }

    async transition register_custom_attribute(
        commitment: field,
        attribute_name: field
    ) -> Future {
        let attr_input: CustomAttrHash = CustomAttrHash {
            target: commitment,
            attr_name: attribute_name
        };
        let attribute_key: field = Poseidon8::hash_to_field(attr_input);

        return finalize_register_custom_attr(attribute_key, attribute_name);
    }

    async function finalize_register_custom_attr(attribute_key: field, attribute_name: field) {
        assert(!Mapping::contains(custom_attributes, attribute_key));
        Mapping::set(custom_attributes, attribute_key, attribute_name);
    }

    async transition vote_on_dispute(
        dispute_key: field,
        voter_address: address,
        approve: bool
    ) -> Future {
        let vote_input: VoteHash = VoteHash {
            dispute_key: dispute_key,
            voter: voter_address
        };
        let vote_key: field = Poseidon8::hash_to_field(vote_input);

        return finalize_vote_on_dispute(dispute_key, vote_key, approve);
    }

    async function finalize_vote_on_dispute(dispute_key: field, vote_key: field, approve: bool) {
        assert(Mapping::contains(disputes, dispute_key));

        // SECURITY FIX: Prevent double voting by enforcing vote uniqueness
        let already_voted: bool = Mapping::contains(casted_votes, vote_key);
        assert(!already_voted);
        Mapping::set(casted_votes, vote_key, true);

        if (approve) {
            let current_yes: u64 = Mapping::get_or_use(governance_votes_yes, dispute_key, 0u64);
            Mapping::set(governance_votes_yes, dispute_key, current_yes + 1u64);
        } else {
            let current_no: u64 = Mapping::get_or_use(governance_votes_no, dispute_key, 0u64);
            Mapping::set(governance_votes_no, dispute_key, current_no + 1u64);
        }
    }
}
