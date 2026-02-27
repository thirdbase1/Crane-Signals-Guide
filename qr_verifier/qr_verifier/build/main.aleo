program qr_verifier.aleo;

struct VerificationRecord:
    verifier as address;
    verified_at as u32;
    commitment_hash as field;
    is_valid as boolean;

mapping verification_proofs:
    key as field.public;
    value as VerificationRecord.public;

mapping verification_history:
    key as field.public;
    value as u32.public;

function verify_qr:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as field.public;
    async verify_qr r0 r1 self.caller into r3;
    output true as boolean.private;
    output r3 as qr_verifier.aleo/verify_qr.future;

finalize verify_qr:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as address.public;
    contains verification_proofs[r1] into r3;
    not r3 into r4;
    assert.eq r4 true;
    cast r2 block.height r0 true into r5 as VerificationRecord;
    set r5 into verification_proofs[r1];

function increment_count:
    input r0 as field.public;
    async increment_count r0 into r1;
    output r1 as qr_verifier.aleo/increment_count.future;

finalize increment_count:
    input r0 as field.public;
    get.or_use verification_history[r0] 0u32 into r1;
    add r1 1u32 into r2;
    set r2 into verification_history[r0];

constructor:
    assert.eq edition 0u16;
