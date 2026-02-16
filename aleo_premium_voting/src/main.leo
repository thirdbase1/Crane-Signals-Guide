import credits.aleo;

program premium_voting_v2.aleo {

    const PLATFORM_FEE: u64 = 5000000u64; // 5 ALEO for DAO creation

    struct DaoInfo {
        name: field,
        token_address: address,
        subscription_fee: u64,
    }

    record ProposalRecord {
        owner: address,
        proposal_id: field,
        dao_owner: address,
        title: field,
        created_at: u32,
    }

    record DaoSubscription {
        owner: address,
        dao_owner: address,
        subscriber: address,
        duration_blocks: u32,
        active: bool,
    }

    // Platform State
    mapping platform_admins: address => bool;
    mapping daos: address => DaoInfo;

    // Create premium DAO (Publicly registered)
    async transition create_premium_dao(
        public name: field,
        public token_address: address,
        public subscription_fee: u64,
        private credits_in: credits.aleo/credits
    ) -> (credits.aleo/credits, credits.aleo/credits, Future) {

        let treasury: address = aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl;

        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            treasury,
            PLATFORM_FEE
        );

        let info: DaoInfo = DaoInfo {
            name: name,
            token_address: token_address,
            subscription_fee: subscription_fee,
        };

        return (change, payment, finalize_create_premium_dao(self.caller, info));
    }

    async function finalize_create_premium_dao(public owner: address, public info: DaoInfo) {
        // Ensure DAO doesn't already exist for this owner
        let exists: bool = Mapping::contains(daos, owner);
        assert(!exists);
        Mapping::set(daos, owner, info);
    }

    // Create a proposal (Only registered DAO owners)
    async transition create_proposal_for_dao(
        public proposal_id: field,
        public title: field
    ) -> (ProposalRecord, Future) {

        let proposal: ProposalRecord = ProposalRecord {
            owner: self.caller,
            proposal_id: proposal_id,
            dao_owner: self.caller,
            title: title,
            created_at: 0u32,
        };

        return (proposal, finalize_create_proposal_dao(self.caller));
    }

    async function finalize_create_proposal_dao(public owner: address) {
        // Verify the caller is a registered DAO owner
        let exists: bool = Mapping::contains(daos, owner);
        assert(exists);
    }

    // Subscribe to DAO (Paid)
    async transition subscribe_paid(
        public dao_owner: address,
        public duration_blocks: u32,
        public dao_fee: u64,
        private credits_in: credits.aleo/credits,
    ) -> (DaoSubscription, credits.aleo/credits, credits.aleo/credits, Future) {

        let total_fee: u64 = duration_blocks as u64 * dao_fee;
        assert(total_fee > 0u64);

        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            dao_owner,
            total_fee
        );

        let subscription: DaoSubscription = DaoSubscription {
            owner: self.caller,
            dao_owner: dao_owner,
            subscriber: self.caller,
            duration_blocks: duration_blocks,
            active: true,
        };

        return (subscription, change, payment, finalize_subscribe_paid(dao_owner, dao_fee));
    }

    async function finalize_subscribe_paid(public dao_owner: address, public dao_fee: u64) {
        // Verify DAO exists and fee matches
        let info: DaoInfo = Mapping::get(daos, dao_owner);
        assert_eq(info.subscription_fee, dao_fee);
    }

    // Subscribe to DAO (Free Trial)
    async transition subscribe_free(
        public dao_owner: address,
    ) -> (DaoSubscription, Future) {

        let subscription: DaoSubscription = DaoSubscription {
            owner: self.caller,
            dao_owner: dao_owner,
            subscriber: self.caller,
            duration_blocks: 1000u32,
            active: true,
        };

        return (subscription, finalize_subscribe_free(dao_owner));
    }

    async function finalize_subscribe_free(public dao_owner: address) {
        let exists: bool = Mapping::contains(daos, dao_owner);
        assert(exists);
    }
}
