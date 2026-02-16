import premium_voting_v1.aleo;

program premium_test.aleo {
    @test
    script test_cast_vote() {
        let result: premium_voting_v1.aleo/VoteRecord = premium_voting_v1.aleo/cast_vote(1field, 123field, 456field, 1u8);
        assert_eq(result.proposal_id, 1field);
    }

    transition dummy() {}

    @noupgrade
    async constructor() {}
}
