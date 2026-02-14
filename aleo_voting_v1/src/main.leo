program voting_v1.aleo {

    // The @admin attribute makes the program upgradeable by the specified address.
    @admin(address="aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl")
    async constructor() {}

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
        pid: u64,
        voter: address,
    }

    mapping proposals: u64 => ProposalData;
    mapping voted: field => bool;

    async transition create_proposal(
        public proposal_id: u64,
        public title_hash: field,
        public duration_blocks: u64,
    ) -> Future {
        return finalize_create_proposal(proposal_id, self.caller, title_hash, duration_blocks);
    }

    async function finalize_create_proposal(
        public proposal_id: u64,
        public creator: address,
        public title_hash: field,
        public duration_blocks: u64,
    ) {
        let proposal_data: ProposalData = ProposalData {
            id: proposal_id,
            creator: creator,
            title_hash: title_hash,
            created_block: block.height,
            duration_blocks: duration_blocks,
            is_finalized: false,
        };

        let exists: bool = Mapping::contains(proposals, proposal_id);
        assert(!exists);

        Mapping::set(proposals, proposal_id, proposal_data);
    }

    async transition cast_private_vote(
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

        let key_data: VoteKey = VoteKey { pid: proposal_id, voter: self.caller };
        let vote_key: field = BHP256::hash_to_field(key_data);

        return (encrypted_vote, finalize_cast_private_vote(vote_key));
    }

    async function finalize_cast_private_vote(public vote_key: field) {
        let has_voted: bool = Mapping::get_or_use(voted, vote_key, false);
        assert(!has_voted);

        Mapping::set(voted, vote_key, true);
    }

    async transition finalize_proposal(public proposal_id: u64) -> Future {
        return finalize_finalize_proposal(proposal_id);
    }

    async function finalize_finalize_proposal(public proposal_id: u64) {
        let proposal: ProposalData = Mapping::get(proposals, proposal_id);

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
