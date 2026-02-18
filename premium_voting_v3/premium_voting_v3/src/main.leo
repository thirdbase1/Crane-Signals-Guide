import credits.aleo;

program premium_voting_v3.aleo {
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
    }

    mapping proposals: u64 => field;
    mapping yes_votes: u64 => u64;
    mapping no_votes: u64 => u64;
    mapping proposal_end_blocks: u64 => u32;

    @noupgrade
    async constructor() {}

    async transition create_proposal_for_dao(
        proposal_id: u64,
        title_hash: field,
        duration_blocks: u64
    ) -> Future {
        return finalize_create_proposal(proposal_id, title_hash, duration_blocks);
    }

    async function finalize_create_proposal(
        proposal_id: u64,
        title_hash: field,
        duration_blocks: u64
    ) {
        Mapping::set(proposals, proposal_id, title_hash);
        let end_block: u32 = block.height + duration_blocks as u32;
        Mapping::set(proposal_end_blocks, proposal_id, end_block);
        Mapping::set(yes_votes, proposal_id, 0u64);
        Mapping::set(no_votes, proposal_id, 0u64);
    }

    async transition subscribe_paid(
        dao_owner: address,
        duration_blocks: u32,
        dao_fee: u64,
        credits_in: credits.aleo/credits
    ) -> (Subscription, credits.aleo/credits, credits.aleo/credits, Future) {
        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            dao_owner,
            dao_fee
        );

        let subscription: Subscription = Subscription {
            owner: self.caller,
            dao_owner: dao_owner,
            start_block: 0u32,
            end_block: duration_blocks,
            fee_paid: dao_fee,
        };

        return (subscription, change, payment, finalize_subscribe_paid());
    }

    async function finalize_subscribe_paid() {
    }

    async transition vote_yes(
        proposal_id: u64,
        vote_hash: field,
        nonce: field
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_hash: vote_hash,
            nonce: nonce,
        };

        return (receipt, finalize_vote_yes(proposal_id));
    }

    async function finalize_vote_yes(proposal_id: u64) {
        let current: u64 = Mapping::get_or_use(yes_votes, proposal_id, 0u64);
        Mapping::set(yes_votes, proposal_id, current + 1u64);
    }

    async transition vote_no(
        proposal_id: u64,
        vote_hash: field,
        nonce: field
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: self.caller,
            proposal_id: proposal_id,
            vote_hash: vote_hash,
            nonce: nonce,
        };

        return (receipt, finalize_vote_no(proposal_id));
    }

    async function finalize_vote_no(proposal_id: u64) {
        let current: u64 = Mapping::get_or_use(no_votes, proposal_id, 0u64);
        Mapping::set(no_votes, proposal_id, current + 1u64);
    }
}
