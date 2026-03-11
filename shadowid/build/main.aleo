program shadowid.aleo;

mapping commitments:
    key as field.public;
    value as u64.public;

mapping attribute_hashes:
    key as field.public;
    value as field.public;

mapping endorsements:
    key as field.public;
    value as boolean.public;

mapping shadow_scores:
    key as field.public;
    value as u64.public;

mapping endorsement_counts:
    key as field.public;
    value as u64.public;

mapping endorsement_timestamps:
    key as field.public;
    value as u64.public;

mapping custom_attributes:
    key as field.public;
    value as field.public;

mapping disputes:
    key as field.public;
    value as boolean.public;

mapping governance_votes_yes:
    key as field.public;
    value as u64.public;

mapping governance_votes_no:
    key as field.public;
    value as u64.public;

mapping casted_votes:
    key as field.public;
    value as boolean.public;

function register_commitment:
    input r0 as field.private;
    input r1 as field.private;
    async register_commitment r0 r1 into r2;
    output r2 as shadowid.aleo/register_commitment.future;

finalize register_commitment:
    input r0 as field.public;
    input r1 as field.public;
    contains commitments[r0] into r2;
    not r2 into r3;
    assert.eq r3 true;
    cast block.height into r4 as u64;
    set r4 into commitments[r0];
    set r1 into attribute_hashes[r0];
    set 50u64 into shadow_scores[r0];
    set 0u64 into endorsement_counts[r0];

function endorse_attribute:
    input r0 as field.private;
    input r1 as u32.private;
    input r2 as address.private;
    cast r2 into r3 as field;
    hash.bhp256 r3 into r4 as field;
    hash.bhp256 r0 into r5 as field;
    add r4 r5 into r6;
    cast r1 into r7 as scalar;
    commit.bhp256 r6 r7 into r8 as field;
    async endorse_attribute r0 r1 r2 r8 into r9;
    output r9 as shadowid.aleo/endorse_attribute.future;

finalize endorse_attribute:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as address.public;
    input r3 as field.public;
    get.or_use commitments[r0] 0u64 into r4;
    gt r4 0u64 into r5;
    assert.eq r5 true;
    contains endorsements[r3] into r6;
    not r6 into r7;
    assert.eq r7 true;
    set true into endorsements[r3];
    cast block.height into r8 as u64;
    set r8 into endorsement_timestamps[r3];
    get.or_use endorsement_counts[r0] 0u64 into r9;
    add r9 1u64 into r10;
    set r10 into endorsement_counts[r0];
    get.or_use shadow_scores[r0] 50u64 into r11;
    add r11 5u64 into r12;
    gt r12 100u64 into r13;
    ternary r13 100u64 r12 into r14;
    set r14 into shadow_scores[r0];

function challenge_endorsement:
    input r0 as field.private;
    input r1 as address.private;
    input r2 as u32.private;
    input r3 as address.private;
    cast r1 into r4 as field;
    hash.bhp256 r4 into r5 as field;
    hash.bhp256 r0 into r6 as field;
    add r5 r6 into r7;
    cast r2 into r8 as scalar;
    commit.bhp256 r7 r8 into r9 as field;
    cast r3 into r10 as scalar;
    commit.bhp256 r9 r10 into r11 as field;
    async challenge_endorsement r11 r9 into r12;
    output r12 as shadowid.aleo/challenge_endorsement.future;

finalize challenge_endorsement:
    input r0 as field.public;
    input r1 as field.public;
    contains endorsements[r1] into r2;
    assert.eq r2 true;
    contains disputes[r0] into r3;
    not r3 into r4;
    assert.eq r4 true;
    set true into disputes[r0];

function register_custom_attribute:
    input r0 as field.private;
    input r1 as field.private;
    cast r1 into r2 as scalar;
    commit.bhp256 r0 r2 into r3 as field;
    async register_custom_attribute r3 r1 into r4;
    output r4 as shadowid.aleo/register_custom_attribute.future;

finalize register_custom_attribute:
    input r0 as field.public;
    input r1 as field.public;
    contains custom_attributes[r0] into r2;
    not r2 into r3;
    assert.eq r3 true;
    set r1 into custom_attributes[r0];

function vote_on_dispute:
    input r0 as field.private;
    input r1 as address.private;
    input r2 as boolean.private;
    cast r1 into r3 as scalar;
    commit.bhp256 r0 r3 into r4 as field;
    async vote_on_dispute r0 r4 r2 into r5;
    output r5 as shadowid.aleo/vote_on_dispute.future;

finalize vote_on_dispute:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as boolean.public;
    contains disputes[r0] into r3;
    assert.eq r3 true;
    contains casted_votes[r1] into r4;
    not r4 into r5;
    assert.eq r5 true;
    set true into casted_votes[r1];
    branch.eq r2 false to end_then_0_0;
    get.or_use governance_votes_yes[r0] 0u64 into r6;
    add r6 1u64 into r7;
    set r7 into governance_votes_yes[r0];
    branch.eq true true to end_otherwise_0_1;
    position end_then_0_0;
    get.or_use governance_votes_no[r0] 0u64 into r8;
    add r8 1u64 into r9;
    set r9 into governance_votes_no[r0];
    position end_otherwise_0_1;

constructor:
    assert.eq true true;
