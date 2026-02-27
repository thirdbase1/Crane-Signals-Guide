import shadowid_v1.aleo;

program test_shadowid_v1.aleo {
    @noupgrade
    async constructor() {}

    @test
    async transition test_register() -> Future {
        let hash: field = 12345field;
        let time: u64 = 100u64;
        let (record_out, fut): (shadowid_v1.aleo/IdentityCommitment, Future) = shadowid_v1.aleo/register_commitment(hash, time);
        return finalize_test_register(fut);
    }

    async function finalize_test_register(fut: Future) {
        fut.await();
    }
}
