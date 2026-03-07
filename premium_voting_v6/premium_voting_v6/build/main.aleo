import credits.aleo;
program premium_voting_v6.aleo;

// Anonymous one-time voting ticket
record VotingTicket:
    owner as address.private;
    proposal_id as u64.private;
    ticket_id as field.private;
    used as boolean.private;

// Vote receipt (anonymous - no address link)
record VoteReceipt:
    owner as address.private;
    ticket_id as field.private;
    proposal_id as u64.private;
    vote_commitment as field.private;
    nonce as field.private;

// Subscription for governance participation
record Subscription:
    owner as address.private;
    dao_owner as address.private;
    start_block as u32.private;
    end_block as u32.private;
    fee_paid as u64.private;

// Public proposal metadata
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

// Encrypted vote tallies (homomorphic encrypted counts)
mapping encrypted_yes_votes:
    key as u64.public;
    value as field.public;

mapping encrypted_no_votes:
    key as u64.public;
    value as field.public;

mapping encrypted_abstain_votes:
    key as u64.public;
    value as field.public;

// Vote commitments for audit trail (no individual votes revealed)
mapping vote_commitments:
    key as field.public;
    value as boolean.public;

// DAO settings
mapping dao_pause_state:
    key as address.public;
    value as boolean.public;

mapping dao_owners:
    key as address.public;
    value as address.public;

mapping ticket_used:
    key as field.public;
    value as boolean.public;

// DAO Registration
function register_dao:
    input r0 as address.public;
    async register_dao r0 self.caller into r1;
    output r1 as premium_voting_v6.aleo/register_dao.future;

finalize register_dao:
    input r0 as address.public;
    input r1 as address.public;
    contains dao_owners[r0] into r2;
    not r2 into r3;
    assert.eq r3 true;
    set r1 into dao_owners[r0];

// Subscription for voting
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
    output r9 as premium_voting_v6.aleo/subscribe_paid.future;

finalize subscribe_paid:
    input r0 as address.public;
    input r1 as u64.public;
    input r2 as u32.public;
    assert.eq r2 block.height;

// Create proposal
function create_proposal:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    input r3 as u8.public;
    input r4 as u64.public;
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

// Issue anonymous voting ticket
function issue_voting_ticket:
    input r0 as u64.public;
    input r1 as field.public;
    cast self.caller r0 r1 false into r2 as VotingTicket.record;
    async issue_voting_ticket r1 into r3;
    output r2 as VotingTicket.record;
    output r3 as premium_voting_v6.aleo/issue_voting_ticket.future;

finalize issue_voting_ticket:
    input r0 as field.public;
    contains ticket_used[r0] into r1;
    not r1 into r2;
    assert.eq r2 true;
    set true into ticket_used[r0];

// Anonymous encrypted vote YES
function vote_encrypted_yes:
    input r0 as VotingTicket.record;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as field.public;
    cast self.caller r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    cast self.caller r0.proposal_id r0.ticket_id true into r5 as VotingTicket.record;
    async vote_encrypted_yes r0.proposal_id r1 r2 into r6;
    output r4 as VoteReceipt.record;
    output r5 as VotingTicket.record;
    output r6 as premium_voting_v6.aleo/vote_encrypted_yes.future;

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

// Anonymous encrypted vote NO
function vote_encrypted_no:
    input r0 as VotingTicket.record;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as field.public;
    cast self.caller r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    cast self.caller r0.proposal_id r0.ticket_id true into r5 as VotingTicket.record;
    async vote_encrypted_no r0.proposal_id r1 r2 into r6;
    output r4 as VoteReceipt.record;
    output r5 as VotingTicket.record;
    output r6 as premium_voting_v6.aleo/vote_encrypted_no.future;

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

// Anonymous encrypted vote ABSTAIN
function vote_encrypted_abstain:
    input r0 as VotingTicket.record;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as field.public;
    cast self.caller r0.ticket_id r0.proposal_id r2 r3 into r4 as VoteReceipt.record;
    cast self.caller r0.proposal_id r0.ticket_id true into r5 as VotingTicket.record;
    async vote_encrypted_abstain r0.proposal_id r1 r2 into r6;
    output r4 as VoteReceipt.record;
    output r5 as VotingTicket.record;
    output r6 as premium_voting_v6.aleo/vote_encrypted_abstain.future;

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

// Emergency pause voting on DAO
function emergency_pause:
    input r0 as address.public;
    async emergency_pause r0 self.caller into r1;
    output r1 as premium_voting_v6.aleo/emergency_pause.future;

finalize emergency_pause:
    input r0 as address.public;
    input r1 as address.public;
    get dao_owners[r0] into r2;
    assert.eq r2 r1;
    set true into dao_pause_state[r0];
