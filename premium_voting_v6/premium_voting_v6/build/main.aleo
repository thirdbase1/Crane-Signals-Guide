import credits.aleo;
program premium_voting_v6.aleo;

record VotingTicket:
    owner as address.private;
    proposal_id as u64.private;
    ticket_id as field.private;
    used as boolean.private;

record VoteReceipt:
    owner as address.private;
    ticket_id as field.private;
    proposal_id as u64.private;
    vote_commitment as field.private;
    nonce as field.private;

record Subscription:
    owner as address.private;
    dao_owner as address.private;
    start_block as u32.private;
    end_block as u32.private;
    fee_paid as u64.private;

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

mapping encrypted_yes_votes:
    key as u64.public;
    value as field.public;

mapping encrypted_no_votes:
    key as u64.public;
    value as field.public;

mapping encrypted_abstain_votes:
    key as u64.public;
    value as field.public;

mapping vote_commitments:
    key as field.public;
    value as boolean.public;

mapping dao_pause_state:
    key as address.public;
    value as boolean.public;

mapping dao_owners:
    key as address.public;
    value as address.public;

mapping ticket_used:
    key as field.public;
    value as boolean.public;

function register_dao:
    input r0 as address.private;
    async register_dao r0 self.caller into r1;
    output r1 as premium_voting_v6.aleo/register_dao.future;

finalize register_dao:
    input r0 as address.public;
    input r1 as address.public;
    contains dao_owners[r0] into r2;
    not r2 into r3;
    assert.eq r3 true;
    set r1 into dao_owners[r0];

function subscribe_paid:
    input r0 as address.private;
    input r1 as u32.private;
    input r2 as u64.private;
    input r3 as credits.aleo/credits.record;
    input r4 as u32.private;
    call credits.aleo/transfer_private r3 r0 r2 into r5 r6;
    add r4 r1 into r7;
    cast self.caller r0 r4 r7 r2 into r8 as Subscription.record;
    async subscribe_paid r4 into r9;
    output r8 as Subscription.record;
    output r5 as credits.aleo/credits.record;
    output r6 as credits.aleo/credits.record;
    output r9 as premium_voting_v6.aleo/subscribe_paid.future;

finalize subscribe_paid:
    input r0 as u32.public;
    is.eq r0 block.height into r1;
    assert.eq r1 true;

function create_proposal:
    input r0 as u64.private;
    input r1 as field.private;
    input r2 as u64.private;
    input r3 as u8.private;
    input r4 as u64.private;
    async create_proposal r0 r1 r2 r3 r4 into r5;
    output r5 as premium_voting_v6.aleo/create_proposal.future;

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
    set r2 into proposal_min_quorum[r0];
    cast r4 into r7 as u32;
    add block.height r7 into r8;
    set r8 into proposal_end_blocks[r0];
    set 0field into encrypted_yes_votes[r0];
    set 0field into encrypted_no_votes[r0];
    set 0field into encrypted_abstain_votes[r0];

function issue_voting_ticket:
    input r0 as Subscription.record;
    input r1 as u64.private;
    cast r0.owner into r2 as field;
    cast r1 into r3 as scalar;
    commit.bhp256 r2 r3 into r4 as field;
    cast r0.owner r1 r4 false into r5 as VotingTicket.record;
    cast r0.owner r0.dao_owner r0.start_block r0.end_block r0.fee_paid into r6 as Subscription.record;
    async issue_voting_ticket r4 r0.end_block r0.dao_owner into r7;
    output r5 as VotingTicket.record;
    output r6 as Subscription.record;
    output r7 as premium_voting_v6.aleo/issue_voting_ticket.future;

finalize issue_voting_ticket:
    input r0 as field.public;
    input r1 as u32.public;
    input r2 as address.public;
    get.or_use dao_pause_state[r2] false into r3;
    not r3 into r4;
    assert.eq r4 true;
    lte block.height r1 into r5;
    assert.eq r5 true;
    contains ticket_used[r0] into r6;
    not r6 into r7;
    assert.eq r7 true;
    set true into ticket_used[r0];

function vote_encrypted_yes:
    input r0 as VotingTicket.record;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    cast r0.owner r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    async vote_encrypted_yes r0.proposal_id r1 r2 into r5;
    output r4 as VoteReceipt.record;
    output r5 as premium_voting_v6.aleo/vote_encrypted_yes.future;

finalize vote_encrypted_yes:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as field.public;
    get proposal_end_blocks[r0] into r3;
    lte block.height r3 into r4;
    assert.eq r4 true;
    contains vote_commitments[r2] into r5;
    not r5 into r6;
    assert.eq r6 true;
    set true into vote_commitments[r2];
    get.or_use encrypted_yes_votes[r0] 0field into r7;
    add r7 r1 into r8;
    set r8 into encrypted_yes_votes[r0];

function vote_encrypted_no:
    input r0 as VotingTicket.record;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    cast r0.owner r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    async vote_encrypted_no r0.proposal_id r1 r2 into r5;
    output r4 as VoteReceipt.record;
    output r5 as premium_voting_v6.aleo/vote_encrypted_no.future;

finalize vote_encrypted_no:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as field.public;
    get proposal_end_blocks[r0] into r3;
    lte block.height r3 into r4;
    assert.eq r4 true;
    contains vote_commitments[r2] into r5;
    not r5 into r6;
    assert.eq r6 true;
    set true into vote_commitments[r2];
    get.or_use encrypted_no_votes[r0] 0field into r7;
    add r7 r1 into r8;
    set r8 into encrypted_no_votes[r0];

function vote_encrypted_abstain:
    input r0 as VotingTicket.record;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as field.private;
    cast r0.owner r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    async vote_encrypted_abstain r0.proposal_id r1 r2 into r5;
    output r4 as VoteReceipt.record;
    output r5 as premium_voting_v6.aleo/vote_encrypted_abstain.future;

finalize vote_encrypted_abstain:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as field.public;
    get proposal_end_blocks[r0] into r3;
    lte block.height r3 into r4;
    assert.eq r4 true;
    contains vote_commitments[r2] into r5;
    not r5 into r6;
    assert.eq r6 true;
    set true into vote_commitments[r2];
    get.or_use encrypted_abstain_votes[r0] 0field into r7;
    add r7 r1 into r8;
    set r8 into encrypted_abstain_votes[r0];

function emergency_pause:
    input r0 as address.private;
    async emergency_pause r0 self.caller into r1;
    output r1 as premium_voting_v6.aleo/emergency_pause.future;

finalize emergency_pause:
    input r0 as address.public;
    input r1 as address.public;
    get dao_owners[r0] into r2;
    is.eq r2 r1 into r3;
    assert.eq r3 true;
    set true into dao_pause_state[r0];

constructor:
    assert.eq edition 0u16;
