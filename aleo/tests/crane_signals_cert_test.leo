import crane_signals_cert.aleo;
program crane_signals_cert_test.aleo {
    @test
    script verify_issue_certification() {
        let receiver: address = aleo1pq7gn8cryzhvc6y8gxkckjwf94acguljs4pd8lwwkyem58rru5gqmnyuyl;
        let cert: crane_signals_cert.aleo/Certification = crane_signals_cert.aleo/issue_certification(receiver, 1u8);
        assert_eq(cert.owner, receiver);
        assert_eq(cert.signal_type, 1u8);
    }

    // Dummy transition to satisfy requirement
    transition dummy() {}

    @noupgrade
    async constructor() {}
}
