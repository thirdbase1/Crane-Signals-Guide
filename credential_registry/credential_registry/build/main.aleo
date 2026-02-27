program credential_registry.aleo;

struct CredentialData:
    holder as address;
    created_at as u32;
    attribute_count as u8;
    is_active as boolean;

mapping credential_commitments:
    key as field.public;
    value as CredentialData.public;

function register_commitment:
    input r0 as field.public;
    input r1 as u8.public;
    async register_commitment r0 r1 self.caller into r2;
    output r2 as credential_registry.aleo/register_commitment.future;

finalize register_commitment:
    input r0 as field.public;
    input r1 as u8.public;
    input r2 as address.public;
    contains credential_commitments[r0] into r3;
    not r3 into r4;
    assert.eq r4 true;
    cast r2 block.height r1 true into r5 as CredentialData;
    set r5 into credential_commitments[r0];

function revoke_credential:
    input r0 as field.public;
    async revoke_credential r0 self.caller into r1;
    output r1 as credential_registry.aleo/revoke_credential.future;

finalize revoke_credential:
    input r0 as field.public;
    input r1 as address.public;
    get credential_commitments[r0] into r2;
    assert.eq r2.holder r1;
    cast r2.holder r2.created_at r2.attribute_count false into r3 as CredentialData;
    set r3 into credential_commitments[r0];

function verify_commitment:
    input r0 as field.public;
    async verify_commitment r0 into r1;
    output r1 as credential_registry.aleo/verify_commitment.future;

finalize verify_commitment:
    input r0 as field.public;
    get credential_commitments[r0] into r1;
    assert.eq r1.is_active true;

constructor:
    assert.eq edition 0u16;
