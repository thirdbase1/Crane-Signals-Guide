import credits.aleo;

program premium_voting_v2.aleo {

    const PLATFORM_FEE: u64 = 5000000u64; // 5 ALEO for DAO creation

    record PremiumDAO {
        owner: address,
        name: field,
        token_address: address,
        subscription_fee: u64,
        active: bool,
    }

    record ProposalRecord {
        owner: address,
        proposal_id: field,
        dao_address: address,
        title: field,
        created_at: u32,
    }

    record DaoSubscription {
        owner: address,
        dao_address: address,
        subscriber: address,
        expiry_block: u32,
        active: bool,
    }

    // Platform Admins
    mapping admins: address => bool;

    // Create premium DAO
    async transition create_premium_dao(
        public name: field,
        public token_address: address,
        public subscription_fee: u64,
        private credits_in: credits.aleo/credits
    ) -> (PremiumDAO, credits.aleo/credits, credits.aleo/credits, Future) {

        let treasury: address = aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl;

        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            treasury,
            PLATFORM_FEE
        );

        let dao_record: PremiumDAO = PremiumDAO {
            owner: self.caller,
            name: name,
            token_address: token_address,
            subscription_fee: subscription_fee,
            active: true,
        };

        return (dao_record, change, payment, finalize_create_premium_dao());
    }

    async function finalize_create_premium_dao() {
        // Log or update global stats
    }

    // Create a proposal for a DAO (Only DAO owner can do this)
    async transition create_proposal(
        public dao: PremiumDAO,
        public proposal_id: field,
        public title: field
    ) -> (ProposalRecord, Future) {

        // Ensure the caller is the DAO owner
        assert_eq(self.caller, dao.owner);

        let proposal: ProposalRecord = ProposalRecord {
            owner: self.caller,
            proposal_id: proposal_id,
            dao_address: dao.owner,
            title: title,
            created_at: 0u32, // To be set in finalize
        };

        return (proposal, finalize_create_proposal());
    }

    async function finalize_create_proposal() {
        // Can track block.height if needed
    }

    // Subscribe to DAO (Paid)
    async transition subscribe_paid(
        public dao_record: PremiumDAO,
        public duration_blocks: u32,
        private credits_in: credits.aleo/credits,
    ) -> (DaoSubscription, credits.aleo/credits, credits.aleo/credits, Future) {

        let total_fee: u64 = duration_blocks as u64 * dao_record.subscription_fee;
        assert(total_fee > 0u64);

        let (change, payment): (credits.aleo/credits, credits.aleo/credits) = credits.aleo/transfer_private(
            credits_in,
            dao_record.owner,
            total_fee
        );

        let subscription: DaoSubscription = DaoSubscription {
            owner: self.caller,
            dao_address: dao_record.owner,
            subscriber: self.caller,
            expiry_block: 0u32, // To be set in finalize
            active: true,
        };

        return (subscription, change, payment, finalize_subscribe_paid(duration_blocks));
    }

    async function finalize_subscribe_paid(duration: u32) {
        // logic to set expiry
    }

    // Subscribe to DAO (Free Trial - 1000 blocks)
    async transition subscribe_free(
        public dao_record: PremiumDAO,
    ) -> (DaoSubscription, Future) {

        let subscription: DaoSubscription = DaoSubscription {
            owner: self.caller,
            dao_address: dao_record.owner,
            subscriber: self.caller,
            expiry_block: 0u32,
            active: true,
        };

        return (subscription, finalize_subscribe_free());
    }

    async function finalize_subscribe_free() {
        // logic to set expiry
    }
}
