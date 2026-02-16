import credits.aleo;

program freemium_voting_v1.aleo {

    // Platform Constants
    const VOTE_FEE: u64 = 100000u64; // 0.1 ALEO
    const PLATFORM_ADMIN: address = aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl;

    record EncryptedVote {
        owner: address,
        proposal_id: u64,
        vote_hash: field,
        nonce: field,
    }

    struct ProposalData {
        id: u64,
        creator: address,
        title_hash: field,
        created_block: u32,
        duration_blocks: u64,
        is_finalized: bool,
    }

    struct VoteKey {
        proposal_id: u64,
        voter: address,
    }

    // On-Chain State
    mapping proposals: u64 => ProposalData;
    mapping voted: field => bool;
    mapping has_used_free_vote: address => bool;

    // Transition: Create Proposal
    // Requirement: Anyone can create a proposal for a small fee? Or only Admin?
    // User choice: Let's allow anyone to create for 1 ALEO to prevent spam.
    async transition create_proposal(
        public proposal_id: u64,
        public title_hash: field,
        public duration_blocks: u64,
        private credits_in: credits.aleo/credits,
    ) -> (credits.aleo/credits, credits.aleo/credits, Future) {

        let fee: u64 = 1000000u64; // 1.0 ALEO
        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            PLATFORM_ADMIN,
            fee
        );

        return (change, payment, finalize_create_proposal(proposal_id, self.caller, title_hash, duration_blocks));
    }

    async function finalize_create_proposal(
        public proposal_id: u64,
        public creator: address,
        public title_hash: field,
        public duration_blocks: u64,
    ) {
        let exists: bool = Mapping::contains(proposals, proposal_id);
        assert(!exists);

        let proposal_data: ProposalData = ProposalData {
            id: proposal_id,
            creator: creator,
            title_hash: title_hash,
            created_block: block.height,
            duration_blocks: duration_blocks,
            is_finalized: false,
        };

        Mapping::set(proposals, proposal_id, proposal_data);
    }

    // Transition: Cast FREE Vote
    // Piece-by-piece logic: Verify lifetime usage, then verify proposal participation.
    async transition cast_vote_free(
        public proposal_id: u64,
        private vote_hash: field,
        private nonce: field,
    ) -> (EncryptedVote, Future) {

        let encrypted_vote: EncryptedVote = EncryptedVote {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_hash: vote_hash,
            nonce: nonce,
        };

        let key_data: VoteKey = VoteKey { proposal_id: proposal_id, voter: self.caller };
        let vote_key: field = BHP256::hash_to_field(key_data);

        return (encrypted_vote, finalize_cast_vote_free(vote_key, self.caller));
    }

    async function finalize_cast_vote_free(public vote_key: field, public voter: address) {
        // 1. Ensure user hasn't used their lifetime free vote
        let already_used: bool = Mapping::get_or_use(has_used_free_vote, voter, false);
        assert(!already_used);

        // 2. Ensure user hasn't voted on this specific proposal
        let has_voted: bool = Mapping::get_or_use(voted, vote_key, false);
        assert(!has_voted);

        Mapping::set(voted, vote_key, true);
        Mapping::set(has_used_free_vote, voter, true);
    }

    // Transition: Cast PAID Vote
    // Piece-by-piece logic: Deduct fee, then verify proposal participation.
    async transition cast_vote_paid(
        public proposal_id: u64,
        private vote_hash: field,
        private nonce: field,
        private credits_in: credits.aleo/credits,
    ) -> (EncryptedVote, credits.aleo/credits, credits.aleo/credits, Future) {

        let (change, transfer_record): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            PLATFORM_ADMIN,
            VOTE_FEE
        );

        let encrypted_vote: EncryptedVote = EncryptedVote {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_hash: vote_hash,
            nonce: nonce,
        };

        let key_data: VoteKey = VoteKey { proposal_id: proposal_id, voter: self.caller };
        let vote_key: field = BHP256::hash_to_field(key_data);

        return (encrypted_vote, change, transfer_record, finalize_cast_vote_paid(vote_key));
    }

    async function finalize_cast_vote_paid(public vote_key: field) {
        let has_voted: bool = Mapping::get_or_use(voted, vote_key, false);
        assert(!has_voted);

        Mapping::set(voted, vote_key, true);
    }

    // Transition: Finalize Proposal
    // Piece-by-piece logic: Enforce creator-only access and update global state.
    async transition finalize_proposal(public proposal_id: u64) -> Future {
        return finalize_finalize_proposal(proposal_id, self.caller);
    }

    async function finalize_finalize_proposal(public proposal_id: u64, public caller: address) {
        let proposal: ProposalData = Mapping::get(proposals, proposal_id);

        // Access Control
        assert_eq(caller, proposal.creator);

        let finalized_proposal: ProposalData = ProposalData {
            id: proposal.id,
            creator: proposal.creator,
            title_hash: proposal.title_hash,
            created_block: proposal.created_block,
            duration_blocks: proposal.duration_blocks,
            is_finalized: true,
        };

        Mapping::set(proposals, proposal_id, finalized_proposal);
    }
}
