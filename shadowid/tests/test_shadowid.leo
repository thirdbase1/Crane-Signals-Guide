// The 'test_shadowid' test program.
import shadowid_final.aleo;
program test_shadowid_final.aleo {
    @test
    script test_it() {
        let result: u32 = shadowid_final.aleo/main(1u32, 2u32);
        assert_eq(result, 3u32);
    }

    @test
    @should_fail
    transition do_nothing() {
        let result: u32 = shadowid_final.aleo/main(2u32, 3u32);
        assert_eq(result, 3u32);
    }

    @noupgrade
    async constructor() {}
}
