import credits.aleo;
program premium_voting_v3.aleo;

record Subscription:
    owner as address.private;
    dao_owner as address.private;
    start_block as u32.private;
    end_block as u32.private;
    fee_paid as u64.private;

record VoteReceipt:
    owner as address.private;
    proposal_id as u64.private;
    vote_hash as field.private;
    nonce as field.private;

mapping proposals:
    key as u64.public;
    value as field.public;

mapping yes_votes:
    key as u64.public;
    value as u64.public;

mapping no_votes:
    key as u64.public;
    value as u64.public;

mapping proposal_end_blocks:
    key as u64.public;
    value as u32.public;

mapping voted_proposals:
    key as field.public;
    value as boolean.public;

function create_proposal_for_dao:
    input r0 as u64.private;
    input r1 as field.private;
    input r2 as u64.private;
    async create_proposal_for_dao r0 r1 r2 into r3;
    output r3 as premium_voting_v3.aleo/create_proposal_for_dao.future;

finalize create_proposal_for_dao:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    contains proposals[r0] into r3;
    not r3 into r4;
    assert.eq r4 true;
    set r1 into proposals[r0];
    cast r2 into r5 as u32;
    add block.height r5 into r6;
    set r6 into proposal_end_blocks[r0];
    set 0u64 into yes_votes[r0];
    set 0u64 into no_votes[r0];

function subscribe_paid:
    input r0 as address.private;
    input r1 as u32.private;
    input r2 as u64.private;
    input r3 as credits.aleo/credits.record;
    input r4 as u32.private;
    call credits.aleo/transfer_private r3 r0 r2 into r5 r6;
    add r4 r1 into r7;
    cast self.caller r0 r4 r7 r2 into r8 as Subscription.record;
    async subscribe_paid into r9;
    output r8 as Subscription.record;
    output r5 as credits.aleo/credits.record;
    output r6 as credits.aleo/credits.record;
    output r9 as premium_voting_v3.aleo/subscribe_paid.future;

finalize subscribe_paid:
    assert.eq true true;

function vote_yes:
    input r0 as u64.private;
    input r1 as field.private;
    input r2 as field.private;
    cast self.caller r0 r1 r2 into r3 as VoteReceipt.record;
    cast self.caller into r4 as field;
    cast r0 into r5 as scalar;
    commit.bhp256 r4 r5 into r6 as field;
    async vote_yes r0 r6 into r7;
    output r3 as VoteReceipt.record;
    output r7 as premium_voting_v3.aleo/vote_yes.future;

finalize vote_yes:
    input r0 as u64.public;
    input r1 as field.public;
    get proposal_end_blocks[r0] into r2;
    lte block.height r2 into r3;
    assert.eq r3 true;
    contains voted_proposals[r1] into r4;
    not r4 into r5;
    assert.eq r5 true;
    set true into voted_proposals[r1];
    get.or_use yes_votes[r0] 0u64 into r6;
    add r6 1u64 into r7;
    set r7 into yes_votes[r0];

function vote_no:
    input r0 as u64.private;
    input r1 as field.private;
    input r2 as field.private;
    cast self.caller r0 r1 r2 into r3 as VoteReceipt.record;
    cast self.caller into r4 as field;
    cast r0 into r5 as scalar;
    commit.bhp256 r4 r5 into r6 as field;
    async vote_no r0 r6 into r7;
    output r3 as VoteReceipt.record;
    output r7 as premium_voting_v3.aleo/vote_no.future;

finalize vote_no:
    input r0 as u64.public;
    input r1 as field.public;
    get proposal_end_blocks[r0] into r2;
    lte block.height r2 into r3;
    assert.eq r3 true;
    contains voted_proposals[r1] into r4;
    not r4 into r5;
    assert.eq r5 true;
    set true into voted_proposals[r1];
    get.or_use no_votes[r0] 0u64 into r6;
    add r6 1u64 into r7;
    set r7 into no_votes[r0];

constructor:
    assert.eq edition 0u16;
