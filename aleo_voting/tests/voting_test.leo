import voting_v1_vibe_coding.aleo;

program voting_test.aleo {
    @test
    script test_create_proposal() {
        let result: Future = voting_v1_vibe_coding.aleo/create_proposal(1u64, 123field, 100u64);
    }

    transition dummy() {}

    @noupgrade
    async constructor() {}
}
