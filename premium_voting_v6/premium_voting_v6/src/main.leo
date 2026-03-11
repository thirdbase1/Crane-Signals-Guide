import credits.aleo;

program premium_voting_v6.aleo {

    // Anonymous one-time voting ticket
    record VotingTicket {
        owner: address,
        proposal_id: u64,
        ticket_id: field,
        used: bool,
    }

    // Vote receipt (anonymous - no address link)
    record VoteReceipt {
        owner: address,
        ticket_id: field,
        proposal_id: u64,
        vote_commitment: field,
        nonce: field,
    }

    // Subscription for governance participation
    record Subscription {
        owner: address,
        dao_owner: address,
        start_block: u32,
        end_block: u32,
        fee_paid: u64,
    }

    // Public proposal metadata
    mapping proposals: u64 => field;
    mapping proposal_end_blocks: u64 => u32;
    mapping proposal_min_quorum: u64 => u64;
    mapping proposal_categories: u64 => u8;

    // Encrypted vote tallies (homomorphic encrypted counts)
    mapping encrypted_yes_votes: u64 => field;
    mapping encrypted_no_votes: u64 => field;
    mapping encrypted_abstain_votes: u64 => field;

    // Vote commitments for audit trail
    mapping vote_commitments: field => bool;

    // DAO settings
    mapping dao_pause_state: address => bool;
    mapping dao_owners: address => address;
    mapping ticket_used: field => bool;

    // DAO Registration
    async transition register_dao(dao: address) -> Future {
        return finalize_register_dao(dao, self.caller);
    }
    async function finalize_register_dao(dao: address, owner: address) {
        assert(!Mapping::contains(dao_owners, dao));
        Mapping::set(dao_owners, dao, owner);
    }

    // Subscription for voting
    async transition subscribe_paid(
        dao_owner: address,
        duration_blocks: u32,
        dao_fee: u64,
        credits_in: credits.aleo/credits,
        start_block: u32
    ) -> (Subscription, credits.aleo/credits, credits.aleo/credits, Future) {
        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(credits_in, dao_owner, dao_fee);

        let sub: Subscription = Subscription {
            owner: self.caller,
            dao_owner: dao_owner,
            start_block: start_block,
            end_block: start_block + duration_blocks,
            fee_paid: dao_fee,
        };
        return (sub, change, payment, finalize_subscribe_paid(start_block));
    }
    async function finalize_subscribe_paid(start_block: u32) {
        assert(start_block == block.height);
    }

    // Create proposal
    async transition create_proposal(
        proposal_id: u64,
        metadata: field,
        min_quorum: u64,
        category: u8,
        duration_blocks: u64
    ) -> Future {
        return finalize_create_proposal(proposal_id, metadata, min_quorum, category, duration_blocks);
    }
    async function finalize_create_proposal(
        proposal_id: u64,
        metadata: field,
        min_quorum: u64,
        category: u8,
        duration_blocks: u64
    ) {
        assert(!Mapping::contains(proposals, proposal_id));
        Mapping::set(proposals, proposal_id, metadata);
        Mapping::set(proposal_categories, proposal_id, category);
        Mapping::set(proposal_min_quorum, proposal_id, min_quorum);

        let end_block: u32 = block.height + duration_blocks as u32;
        Mapping::set(proposal_end_blocks, proposal_id, end_block);

        // Initialize with homomorphic encryption identity (0 for additive)
        Mapping::set(encrypted_yes_votes, proposal_id, 0field);
        Mapping::set(encrypted_no_votes, proposal_id, 0field);
        Mapping::set(encrypted_abstain_votes, proposal_id, 0field);
    }

    // Issue anonymous voting ticket
    async transition issue_voting_ticket(
        sub: Subscription,
        proposal_id: u64
    ) -> (VotingTicket, Subscription, Future) {
        let owner_field: field = sub.owner as field;
        let ticket_id: field = BHP256::commit_to_field(owner_field, proposal_id as scalar);

        let ticket: VotingTicket = VotingTicket {
            owner: sub.owner,
            proposal_id: proposal_id,
            ticket_id: ticket_id,
            used: false,
        };

        let returned_sub: Subscription = Subscription {
            owner: sub.owner,
            dao_owner: sub.dao_owner,
            start_block: sub.start_block,
            end_block: sub.end_block,
            fee_paid: sub.fee_paid,
        };

        return (ticket, returned_sub, finalize_issue_voting_ticket(ticket_id, sub.end_block, sub.dao_owner));
    }
    async function finalize_issue_voting_ticket(ticket_id: field, sub_end_block: u32, dao: address) {
        let is_paused: bool = Mapping::get_or_use(dao_pause_state, dao, false);
        assert(!is_paused);

        assert(block.height <= sub_end_block);

        assert(!Mapping::contains(ticket_used, ticket_id));
        Mapping::set(ticket_used, ticket_id, true);
    }

    // Anonymous encrypted vote YES
    async transition vote_encrypted_yes(
        ticket: VotingTicket,
        encrypted_vote: field,
        vote_commitment: field,
        nonce: field
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: ticket.owner,
            ticket_id: ticket.ticket_id,
            proposal_id: ticket.proposal_id,
            vote_commitment: vote_commitment,
            nonce: nonce,
        };
        return (receipt, finalize_vote_encrypted_yes(ticket.proposal_id, encrypted_vote, vote_commitment));
    }
    async function finalize_vote_encrypted_yes(proposal_id: u64, encrypted_vote: field, vote_commitment: field) {
        let end_block: u32 = Mapping::get(proposal_end_blocks, proposal_id);
        assert(block.height <= end_block);

        assert(!Mapping::contains(vote_commitments, vote_commitment));
        Mapping::set(vote_commitments, vote_commitment, true);

        let current: field = Mapping::get_or_use(encrypted_yes_votes, proposal_id, 0field);
        Mapping::set(encrypted_yes_votes, proposal_id, current + encrypted_vote);
    }

    // Anonymous encrypted vote NO
    async transition vote_encrypted_no(
        ticket: VotingTicket,
        encrypted_vote: field,
        vote_commitment: field,
        nonce: field
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: ticket.owner,
            ticket_id: ticket.ticket_id,
            proposal_id: ticket.proposal_id,
            vote_commitment: vote_commitment,
            nonce: nonce,
        };
        return (receipt, finalize_vote_encrypted_no(ticket.proposal_id, encrypted_vote, vote_commitment));
    }
    async function finalize_vote_encrypted_no(proposal_id: u64, encrypted_vote: field, vote_commitment: field) {
        let end_block: u32 = Mapping::get(proposal_end_blocks, proposal_id);
        assert(block.height <= end_block);

        assert(!Mapping::contains(vote_commitments, vote_commitment));
        Mapping::set(vote_commitments, vote_commitment, true);

        let current: field = Mapping::get_or_use(encrypted_no_votes, proposal_id, 0field);
        Mapping::set(encrypted_no_votes, proposal_id, current + encrypted_vote);
    }

    // Anonymous encrypted vote ABSTAIN
    async transition vote_encrypted_abstain(
        ticket: VotingTicket,
        encrypted_vote: field,
        vote_commitment: field,
        nonce: field
    ) -> (VoteReceipt, Future) {
        let receipt: VoteReceipt = VoteReceipt {
            owner: ticket.owner,
            ticket_id: ticket.ticket_id,
            proposal_id: ticket.proposal_id,
            vote_commitment: vote_commitment,
            nonce: nonce,
        };
        return (receipt, finalize_vote_encrypted_abstain(ticket.proposal_id, encrypted_vote, vote_commitment));
    }
    async function finalize_vote_encrypted_abstain(proposal_id: u64, encrypted_vote: field, vote_commitment: field) {
        let end_block: u32 = Mapping::get(proposal_end_blocks, proposal_id);
        assert(block.height <= end_block);

        assert(!Mapping::contains(vote_commitments, vote_commitment));
        Mapping::set(vote_commitments, vote_commitment, true);

        let current: field = Mapping::get_or_use(encrypted_abstain_votes, proposal_id, 0field);
        Mapping::set(encrypted_abstain_votes, proposal_id, current + encrypted_vote);
    }

    // Emergency pause voting on DAO
    async transition emergency_pause(dao: address) -> Future {
        return finalize_emergency_pause(dao, self.caller);
    }
    async function finalize_emergency_pause(dao: address, caller: address) {
        let owner: address = Mapping::get(dao_owners, dao);
        assert(owner == caller);
        Mapping::set(dao_pause_state, dao, true);
    }




    @custom
    async constructor() {
        assert_eq(true, true);
    }
}
