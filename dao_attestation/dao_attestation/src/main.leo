program dao_attestation_v1.aleo {
    struct DAOInfo {
        dao_id: field,
        name: field,
        leader: address,
        created_at: u32,
        is_active: bool,
    }

    struct AttestationRequest {
        request_id: field,
        user: address,
        dao_id: field,
        created_at: u32,
        status: u8, // 0: Pending, 1: Approved, 2: Rejected
    }

    struct ApprovedAttestation {
        attestation_id: field,
        user: address,
        dao_id: field,
        sig_field: field,
        approved_at: u32,
        expires_at: u64,
        is_revoked: bool,
    }

    mapping daos: field => DAOInfo;
    mapping dao_leaders: address => field;
    mapping attestation_requests: field => AttestationRequest;
    mapping approved_attestations: field => ApprovedAttestation;
    mapping revoked_attestations: field => bool;

    @noupgrade
    async constructor() {}

    async transition register_dao(public dao_id: field, public name: field) -> Future {
        return finalize_register(dao_id, name, self.caller);
    }

    async function finalize_register(public dao_id: field, public name: field, public leader: address) {
        // SECURITY FIX: Prevent overwriting existing DAOs
        assert(!Mapping::contains(daos, dao_id));

        let info: DAOInfo = DAOInfo {
            dao_id: dao_id,
            name: name,
            leader: leader,
            created_at: block.height,
            is_active: true,
        };
        Mapping::set(daos, dao_id, info);
        Mapping::set(dao_leaders, leader, dao_id);
    }

    async transition request_attestation(public request_id: field, public dao_id: field) -> Future {
        return finalize_request(request_id, dao_id, self.caller);
    }

    async function finalize_request(public request_id: field, public dao_id: field, public user: address) {
        let dao: DAOInfo = Mapping::get(daos, dao_id);
        assert(dao.is_active);

        // Generate a unique hash for the record
        let record_id: field = BHP256::hash_to_field(request_id);

        // SECURITY FIX: Prevent overwriting existing requests
        assert(!Mapping::contains(attestation_requests, record_id));

        let request: AttestationRequest = AttestationRequest {
            request_id: request_id,
            user: user,
            dao_id: dao_id,
            created_at: block.height,
            status: 0u8,
        };
        Mapping::set(attestation_requests, record_id, request);
    }

    async transition approve_attestation(
        public request_record_id: field,
        public sig_field: field,
        public expires_at: u64
    ) -> Future {
        return finalize_approve(request_record_id, sig_field, expires_at, self.caller);
    }

    async function finalize_approve(
        public request_id: field,
        public sig_field: field,
        public expires_at: u64,
        public leader: address
    ) {
        let request: AttestationRequest = Mapping::get(attestation_requests, request_id);
        let leader_dao_id: field = Mapping::get(dao_leaders, leader);

        // SECURITY: Ensure caller is the leader of the specific DAO
        assert_eq(leader_dao_id, request.dao_id);

        let attestation_id: field = BHP256::hash_to_field(sig_field);

        let approved: ApprovedAttestation = ApprovedAttestation {
            attestation_id: attestation_id,
            user: request.user,
            dao_id: request.dao_id,
            sig_field: sig_field,
            approved_at: block.height,
            expires_at: expires_at,
            is_revoked: false,
        };

        Mapping::set(approved_attestations, attestation_id, approved);

        let updated_request: AttestationRequest = AttestationRequest {
            request_id: request.request_id,
            user: request.user,
            dao_id: request.dao_id,
            created_at: request.created_at,
            status: 1u8,
        };
        Mapping::set(attestation_requests, request_id, updated_request);
    }

    async transition verify_attestation(public attestation_id: field) -> Future {
        return finalize_verify(attestation_id);
    }

    async function finalize_verify(public attestation_id: field) {
        let approved: ApprovedAttestation = Mapping::get(approved_attestations, attestation_id);
        let is_revoked: bool = Mapping::get_or_use(revoked_attestations, attestation_id, false);

        assert(!is_revoked);
        assert(approved.expires_at > block.height as u64);
    }

    async transition revoke_attestation(public attestation_id: field) -> Future {
        return finalize_revoke(attestation_id, self.caller);
    }

    async function finalize_revoke(public attestation_id: field, public caller: address) {
        let approved: ApprovedAttestation = Mapping::get(approved_attestations, attestation_id);

        assert_eq(approved.user, caller);

        Mapping::set(revoked_attestations, attestation_id, true);
    }

    async transition reject_request(public request_id: field) -> Future {
        return finalize_reject(request_id, self.caller);
    }

    async function finalize_reject(public request_id: field, public leader: address) {
        let request: AttestationRequest = Mapping::get(attestation_requests, request_id);
        let leader_dao_id: field = Mapping::get(dao_leaders, leader);

        assert_eq(leader_dao_id, request.dao_id);

        let updated_request: AttestationRequest = AttestationRequest {
            request_id: request.request_id,
            user: request.user,
            dao_id: request.dao_id,
            created_at: request.created_at,
            status: 2u8,
        };
        Mapping::set(attestation_requests, request_id, updated_request);
    }
}
