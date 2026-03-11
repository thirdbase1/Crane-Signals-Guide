import credits.aleo;
program premium_voting_v4.aleo;

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
    vote_weight as u64.private;

mapping proposals:
    key as u64.public;
    value as field.public;

mapping proposal_end_blocks:
    key as u64.public;
    value as u32.public;

mapping proposal_min_quorum:
    key as u64.public;
    value as u64.public;

mapping proposal_categories:
    key as u64.public;
    value as u8.public;

mapping yes_votes:
    key as u64.public;
    value as u64.public;

mapping no_votes:
    key as u64.public;
    value as u64.public;

mapping abstain_votes:
    key as u64.public;
    value as u64.public;

mapping voted_proposals:
    key as field.public;
    value as boolean.public;

mapping user_token_balance:
    key as address.public;
    value as u64.public;

mapping dao_pause_state:
    key as address.public;
    value as boolean.public;

mapping dao_owners:
    key as address.public;
    value as address.public;

function register_dao:
    input r0 as address.public;
    async register_dao r0 self.caller into r1;
    output r1 as premium_voting_v4.aleo/register_dao.future;

finalize register_dao:
    input r0 as address.public;
    input r1 as address.public;
    contains dao_owners[r0] into r2;
    not r2 into r3;
    assert.eq r3 true;
    set r1 into dao_owners[r0];

function subscribe_paid:
    input r0 as address.public;
    input r1 as u32.public;
    input r2 as u64.public;
    input r3 as credits.aleo/credits.record;
    input r4 as u32.public;
    call credits.aleo/transfer_private r3 r0 r2 into r5 r6;
    add r4 r1 into r7;
    cast self.caller r0 r4 r7 r2 into r8 as Subscription.record;
    async subscribe_paid self.caller r2 r4 into r9;
    output r8 as Subscription.record;
    output r5 as credits.aleo/credits.record;
    output r6 as credits.aleo/credits.record;
    output r9 as premium_voting_v4.aleo/subscribe_paid.future;

finalize subscribe_paid:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u32.public;
    assert.eq r2 block.height;
    get.or_use user_token_balance[r0] 0u64 into r3;
    add r3 r1 into r4;
    set r4 into user_token_balance[r0];

function create_proposal:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    input r3 as u8.public;
    input r4 as u64.public;
    async create_proposal r0 r1 r2 r3 r4 into r5;
    output r5 as premium_voting_v4.aleo/create_proposal.future;

finalize create_proposal:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    input r3 as u8.public;
    input r4 as u64.public;
    contains proposals[r0] into r5;
    not r5 into r6;
    assert.eq r6 true;
    set r1 into proposals[r0];
    set r3 into proposal_categories[r0];
    set r4 into proposal_min_quorum[r0];
    cast r2 into r7 as u32;
    add block.height r7 into r8;
    set r8 into proposal_end_blocks[r0];
    set 0u64 into yes_votes[r0];
    set 0u64 into no_votes[r0];
    set 0u64 into abstain_votes[r0];

function vote_yes:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as u64.public;
    input r4 as address.public;
    cast self.caller r0 r1 r2 r3 into r5 as VoteReceipt.record;
    cast self.caller into r6 as field;
    cast r0 into r7 as scalar;
    commit.bhp256 r6 r7 into r8 as field;
    async vote_yes r0 r8 r3 r4 into r9;
    output r5 as VoteReceipt.record;
    output r9 as premium_voting_v4.aleo/vote_yes.future;

finalize vote_yes:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    input r3 as address.public;
    get proposal_end_blocks[r0] into r4;
    lte block.height r4 into r5;
    assert.eq r5 true;
    get.or_use dao_pause_state[r3] false into r6;
    not r6 into r7;
    assert.eq r7 true;
    contains voted_proposals[r1] into r8;
    not r8 into r9;
    assert.eq r9 true;
    set true into voted_proposals[r1];
    get.or_use yes_votes[r0] 0u64 into r10;
    add r10 r2 into r11;
    set r11 into yes_votes[r0];

function emergency_pause:
    input r0 as address.public;
    async emergency_pause r0 self.caller into r1;
    output r1 as premium_voting_v4.aleo/emergency_pause.future;

finalize emergency_pause:
    input r0 as address.public;
    input r1 as address.public;
    get dao_owners[r0] into r2;
    assert.eq r2 r1;
    set true into dao_pause_state[r0];

constructor:
    assert.eq edition 0u16;
