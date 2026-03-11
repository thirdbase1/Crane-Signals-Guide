import credits.aleo;

program premium_voting_v4.aleo {

    @noupgrade
    async constructor() {}

    record Subscription {
        owner: address,
        dao_owner: address,
        start_block: u32,
        end_block: u32,
        fee_paid: u64,
    }

    record VoteReceipt {
        owner: address,
        proposal_id: u64,
        vote_hash: field,
        nonce: field,
        vote_weight: u64,
    }

    // Core proposal data
    mapping proposals: u64 => field;
    mapping proposal_end_blocks: u64 => u32;
    mapping proposal_min_quorum: u64 => u64;
    mapping proposal_categories: u64 => u8;

    // Weighted vote tracking
    mapping yes_votes: u64 => u64;
    mapping no_votes: u64 => u64;
    mapping abstain_votes: u64 => u64;

    // Security state
    mapping voted_proposals: field => bool;
    mapping user_token_balance: address => u64;
    mapping dao_pause_state: address => bool;
    mapping dao_owners: address => address; // DAO Address => Owner Address

    async transition register_dao(public dao_address: address) -> Future {
        return finalize_register_dao(dao_address, self.caller);
    }

    async function finalize_register_dao(public dao_address: address, public owner: address) {
        assert(!Mapping::contains(dao_owners, dao_address));
        Mapping::set(dao_owners, dao_address, owner);
    }

    async transition subscribe_paid(
        public dao_owner: address,
        public duration_blocks: u32,
        public dao_fee: u64,
        credits_in: credits.aleo/credits,
        public current_height: u32
    ) -> (Subscription, credits.aleo/credits, credits.aleo/credits, Future) {
        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            dao_owner,
            dao_fee
        );

        let subscription: Subscription = Subscription {
            owner: self.caller,
            dao_owner: dao_owner,
            start_block: current_height,
            end_block: current_height + duration_blocks,
            fee_paid: dao_fee,
        };

        return (subscription, change, payment, finalize_subscribe_paid(self.caller, dao_fee, current_height));
    }

    async function finalize_subscribe_paid(public user: address, public fee: u64, public height: u32) {
        assert_eq(height, block.height);
        let current: u64 = Mapping::get_or_use(user_token_balance, user, 0u64);
        Mapping::set(user_token_balance, user, current + fee);
    }

    async transition create_proposal(
        public proposal_id: u64,
        public title_hash: field,
        public duration: u64,
        public category: u8,
        public min_quorum: u64
    ) -> Future {
        return finalize_create_proposal(proposal_id, title_hash, duration, category, min_quorum);
    }

    async function finalize_create_proposal(
        public proposal_id: u64,
        public title_hash: field,
        public duration: u64,
        public category: u8,
        public min_quorum: u64
    ) {
        assert(!Mapping::contains(proposals, proposal_id));

        Mapping::set(proposals, proposal_id, title_hash);
        Mapping::set(proposal_categories, proposal_id, category);
        Mapping::set(proposal_min_quorum, proposal_id, min_quorum);

        let end_block: u32 = block.height + duration as u32;
        Mapping::set(proposal_end_blocks, proposal_id, end_block);

        Mapping::set(yes_votes, proposal_id, 0u64);
        Mapping::set(no_votes, proposal_id, 0u64);
        Mapping::set(abstain_votes, proposal_id, 0u64);
    }

    async transition vote_yes(
        public proposal_id: u64,
        public vote_hash: field,
        public nonce: field,
        public weight: u64,
        public dao_address: address
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_hash: vote_hash,
            nonce: nonce,
            vote_weight: weight,
        };

        // Standardized double-vote protection hash
        let voter_field: field = self.caller as field;
        let vote_id: field = BHP256::commit_to_field(voter_field, proposal_id as scalar);

        return (receipt, finalize_vote_yes(proposal_id, vote_id, weight, dao_address));
    }

    async function finalize_vote_yes(
        public proposal_id: u64,
        public vote_id: field,
        public weight: u64,
        public dao_address: address
    ) {
        let end_block: u32 = Mapping::get(proposal_end_blocks, proposal_id);
        assert(block.height <= end_block);

        let is_paused: bool = Mapping::get_or_use(dao_pause_state, dao_address, false);
        assert(!is_paused);

        assert(!Mapping::contains(voted_proposals, vote_id));
        Mapping::set(voted_proposals, vote_id, true);

        let current: u64 = Mapping::get_or_use(yes_votes, proposal_id, 0u64);
        Mapping::set(yes_votes, proposal_id, current + weight);
    }

    async transition emergency_pause(public dao_address: address) -> Future {
        return finalize_emergency_pause(dao_address, self.caller);
    }

    async function finalize_emergency_pause(public dao_address: address, public caller: address) {
        // SECURITY: Only the registered owner of this DAO can pause
        let owner: address = Mapping::get(dao_owners, dao_address);
        assert_eq(owner, caller);
        Mapping::set(dao_pause_state, dao_address, true);
    }
}
