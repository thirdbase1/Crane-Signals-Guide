program crane_signals_cert.aleo {
    @noupgrade
    async constructor() {}

    record Certification {
        owner: address,
        issuer: address,
        signal_type: u8,
    }

    transition issue_certification(receiver: address, signal_type: u8) -> Certification {
        return Certification {
            owner: receiver,
            issuer: self.caller,
            signal_type: signal_type,
        };
    }
}
