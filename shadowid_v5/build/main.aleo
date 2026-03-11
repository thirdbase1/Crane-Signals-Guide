program shadowid_v5.aleo;

struct EndorsementHash:
    endorser as address;
    target as field;
    attr_id as u32;

struct DisputeHash:
    dedup_key as field;
    challenger as address;

struct CustomAttrHash:
    target as field;
    attr_name as field;

struct VoteHash:
    dispute_key as field;
    voter as address;

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
    output r2 as shadowid_v5.aleo/register_commitment.future;

finalize register_commitment:
    input r0 as field.public;
    input r1 as field.public;
    get.or_use commitments[r0] 0u64 into r2;
    is.eq r2 0u64 into r3;
    assert.eq r3 true;
    cast block.height into r4 as u64;
    set r4 into commitments[r0];
    set r1 into attribute_hashes[r0];
    set 50u64 into shadow_scores[r0];
    set 0u64 into endorsement_counts[r0];

function verify_commitment:
    input r0 as field.private;
    async verify_commitment r0 into r1;
    output true as boolean.private;
    output r1 as shadowid_v5.aleo/verify_commitment.future;

finalize verify_commitment:
    input r0 as field.public;
    get.or_use commitments[r0] 0u64 into r1;
    gt r1 0u64 into r2;
    assert.eq r2 true;

function verify_attribute_hash:
    input r0 as field.private;
    input r1 as field.private;
    async verify_attribute_hash r0 r1 into r2;
    output true as boolean.private;
    output r2 as shadowid_v5.aleo/verify_attribute_hash.future;

finalize verify_attribute_hash:
    input r0 as field.public;
    input r1 as field.public;
    get.or_use attribute_hashes[r0] 0field into r2;
    is.eq r2 r1 into r3;
    assert.eq r3 true;

function endorse_attribute:
    input r0 as field.private;
    input r1 as u32.private;
    input r2 as address.private;
    cast r2 r0 r1 into r3 as EndorsementHash;
    hash.psd8 r3 into r4 as field;
    async endorse_attribute r0 r4 into r5;
    output r5 as shadowid_v5.aleo/endorse_attribute.future;

finalize endorse_attribute:
    input r0 as field.public;
    input r1 as field.public;
    get.or_use commitments[r0] 0u64 into r2;
    gt r2 0u64 into r3;
    assert.eq r3 true;
    contains endorsements[r1] into r4;
    not r4 into r5;
    assert.eq r5 true;
    set true into endorsements[r1];
    cast block.height into r6 as u64;
    set r6 into endorsement_timestamps[r1];
    get.or_use endorsement_counts[r0] 0u64 into r7;
    add r7 1u64 into r8;
    set r8 into endorsement_counts[r0];
    get.or_use shadow_scores[r0] 50u64 into r9;
    add r9 5u64 into r10;
    gt r10 100u64 into r11;
    ternary r11 100u64 r10 into r12;
    set r12 into shadow_scores[r0];

function challenge_endorsement:
    input r0 as field.private;
    input r1 as address.private;
    input r2 as u32.private;
    input r3 as address.private;
    cast r1 r0 r2 into r4 as EndorsementHash;
    hash.psd8 r4 into r5 as field;
    cast r5 r3 into r6 as DisputeHash;
    hash.psd8 r6 into r7 as field;
    async challenge_endorsement r7 r5 into r8;
    output r8 as shadowid_v5.aleo/challenge_endorsement.future;

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
    cast r0 r1 into r2 as CustomAttrHash;
    hash.psd8 r2 into r3 as field;
    async register_custom_attribute r3 r1 into r4;
    output r4 as shadowid_v5.aleo/register_custom_attribute.future;

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
    cast r0 r1 into r3 as VoteHash;
    hash.psd8 r3 into r4 as field;
    async vote_on_dispute r0 r4 r2 into r5;
    output r5 as shadowid_v5.aleo/vote_on_dispute.future;

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
