program shadowid.aleo {

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
        assert(!Mapping::contains(commitments, commitment));
        Mapping::set(commitments, commitment, block.height as u64);
        Mapping::set(attribute_hashes, commitment, attribute_hash);
        Mapping::set(shadow_scores, commitment, 50u64);
        Mapping::set(endorsement_counts, commitment, 0u64);
    }

    async transition endorse_attribute(
        target_commitment: field,
        attribute_id: u32,
        endorser_address: address
    ) -> Future {
        let h1: field = BHP256::hash_to_field(endorser_address as field);
        let h2: field = BHP256::hash_to_field(target_commitment);
        let h3: field = h1 + h2;
        let dedup_key: field = BHP256::commit_to_field(h3, attribute_id as scalar);

        return finalize_endorse_attribute(target_commitment, attribute_id, endorser_address, dedup_key);
    }

    async function finalize_endorse_attribute(
        target_commitment: field,
        attribute_id: u32,
        endorser_address: address,
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
        let h1: field = BHP256::hash_to_field(endorser_address as field);
        let h2: field = BHP256::hash_to_field(target_commitment);
        let h3: field = h1 + h2;
        let dedup_key: field = BHP256::commit_to_field(h3, attribute_id as scalar);

        let dispute_key: field = BHP256::commit_to_field(dedup_key, challenger_address as scalar);

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
        let attribute_key: field = BHP256::commit_to_field(commitment, attribute_name as scalar);
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
        let vote_key: field = BHP256::commit_to_field(dispute_key, voter_address as scalar);
        return finalize_vote_on_dispute(dispute_key, vote_key, approve);
    }

    async function finalize_vote_on_dispute(dispute_key: field, vote_key: field, approve: bool) {
        assert(Mapping::contains(disputes, dispute_key));
        assert(!Mapping::contains(casted_votes, vote_key));
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
