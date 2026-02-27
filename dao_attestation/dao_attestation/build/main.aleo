program dao_attestation_v1.aleo;

struct DAOInfo:
    dao_id as field;
    name as field;
    leader as address;
    created_at as u32;
    is_active as boolean;

struct AttestationRequest:
    request_id as field;
    user as address;
    dao_id as field;
    created_at as u32;
    status as u8;

struct ApprovedAttestation:
    attestation_id as field;
    user as address;
    dao_id as field;
    sig_field as field;
    approved_at as u32;
    expires_at as u64;
    is_revoked as boolean;

mapping daos:
    key as field.public;
    value as DAOInfo.public;

mapping dao_leaders:
    key as address.public;
    value as field.public;

mapping attestation_requests:
    key as field.public;
    value as AttestationRequest.public;

mapping approved_attestations:
    key as field.public;
    value as ApprovedAttestation.public;

mapping revoked_attestations:
    key as field.public;
    value as boolean.public;

function register_dao:
    input r0 as field.public;
    input r1 as field.public;
    async register_dao r0 r1 self.caller into r2;
    output r2 as dao_attestation_v1.aleo/register_dao.future;

finalize register_dao:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as address.public;
    contains daos[r0] into r3;
    not r3 into r4;
    assert.eq r4 true;
    cast r0 r1 r2 block.height true into r5 as DAOInfo;
    set r5 into daos[r0];
    set r0 into dao_leaders[r2];

function request_attestation:
    input r0 as field.public;
    input r1 as field.public;
    async request_attestation r0 r1 self.caller into r2;
    output r2 as dao_attestation_v1.aleo/request_attestation.future;

finalize request_attestation:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as address.public;
    get daos[r1] into r3;
    assert.eq r3.is_active true;
    hash.bhp256 r0 into r4 as field;
    contains attestation_requests[r4] into r5;
    not r5 into r6;
    assert.eq r6 true;
    cast r0 r2 r1 block.height 0u8 into r7 as AttestationRequest;
    set r7 into attestation_requests[r4];

function approve_attestation:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as u64.public;
    async approve_attestation r0 r1 r2 self.caller into r3;
    output r3 as dao_attestation_v1.aleo/approve_attestation.future;

finalize approve_attestation:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as u64.public;
    input r3 as address.public;
    get attestation_requests[r0] into r4;
    get dao_leaders[r3] into r5;
    assert.eq r5 r4.dao_id;
    hash.bhp256 r1 into r6 as field;
    cast r6 r4.user r4.dao_id r1 block.height r2 false into r7 as ApprovedAttestation;
    set r7 into approved_attestations[r6];
    cast r4.request_id r4.user r4.dao_id r4.created_at 1u8 into r8 as AttestationRequest;
    set r8 into attestation_requests[r0];

function verify_attestation:
    input r0 as field.public;
    async verify_attestation r0 into r1;
    output r1 as dao_attestation_v1.aleo/verify_attestation.future;

finalize verify_attestation:
    input r0 as field.public;
    get approved_attestations[r0] into r1;
    get.or_use revoked_attestations[r0] false into r2;
    not r2 into r3;
    assert.eq r3 true;
    cast block.height into r4 as u64;
    gt r1.expires_at r4 into r5;
    assert.eq r5 true;

function revoke_attestation:
    input r0 as field.public;
    async revoke_attestation r0 self.caller into r1;
    output r1 as dao_attestation_v1.aleo/revoke_attestation.future;

finalize revoke_attestation:
    input r0 as field.public;
    input r1 as address.public;
    get approved_attestations[r0] into r2;
    assert.eq r2.user r1;
    set true into revoked_attestations[r0];

function reject_request:
    input r0 as field.public;
    async reject_request r0 self.caller into r1;
    output r1 as dao_attestation_v1.aleo/reject_request.future;

finalize reject_request:
    input r0 as field.public;
    input r1 as address.public;
    get attestation_requests[r0] into r2;
    get dao_leaders[r1] into r3;
    assert.eq r3 r2.dao_id;
    cast r2.request_id r2.user r2.dao_id r2.created_at 2u8 into r4 as AttestationRequest;
    set r4 into attestation_requests[r0];

constructor:
    assert.eq edition 0u16;
