import premium_voting_v2_jules.aleo;

program test_premium_voting_v2.aleo {
    @test
    transition test_create_proposal() {
        let proposal_id: u64 = 1u64;
        let title_hash: field = 12345field;
        let duration: u64 = 100u64;

        let result: Future = premium_voting_v2_jules.aleo/create_proposal_for_dao(proposal_id, title_hash, duration);
    }
}
