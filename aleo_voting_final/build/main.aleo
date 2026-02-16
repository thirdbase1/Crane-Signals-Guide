import credits.aleo;
program voting_v1.aleo;

record EncryptedVote:
    owner as address.private;
    proposal_id as u64.private;
    vote_hash as field.private;
    nonce as field.private;

struct ProposalData:
    id as u64;
    creator as address;
    title_hash as field;
    created_block as u32;
    duration_blocks as u64;
    is_finalized as boolean;

struct VoteKey:
    pid as u64;
    voter as address;

mapping proposals:
    key as u64.public;
    value as ProposalData.public;

mapping voted:
    key as field.public;
    value as boolean.public;

function create_proposal:
    input r0 as u64.public;
    input r1 as field.public;
    input r2 as u64.public;
    async create_proposal r0 self.caller r1 r2 into r3;
    output r3 as voting_v1.aleo/create_proposal.future;

finalize create_proposal:
    input r0 as u64.public;
    input r1 as address.public;
    input r2 as field.public;
    input r3 as u64.public;
    cast r0 r1 r2 block.height r3 false into r4 as ProposalData;
    contains proposals[r0] into r5;
    not r5 into r6;
    assert.eq r6 true;
    set r4 into proposals[r0];

function cast_private_vote:
    input r0 as u64.public;
    input r1 as field.private;
    input r2 as field.private;
    input r3 as credits.aleo/credits.record;
    call credits.aleo/transfer_private r3 aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl 100000u64 into r4 r5;
    cast self.caller r0 r1 r2 into r6 as EncryptedVote.record;
    cast r0 self.caller into r7 as VoteKey;
    hash.bhp256 r7 into r8 as field;
    async cast_private_vote r8 into r9;
    output r6 as EncryptedVote.record;
    output r4 as credits.aleo/credits.record;
    output r5 as credits.aleo/credits.record;
    output r9 as voting_v1.aleo/cast_private_vote.future;

finalize cast_private_vote:
    input r0 as field.public;
    get.or_use voted[r0] false into r1;
    not r1 into r2;
    assert.eq r2 true;
    set true into voted[r0];

function finalize_proposal:
    input r0 as u64.public;
    async finalize_proposal r0 self.caller into r1;
    output r1 as voting_v1.aleo/finalize_proposal.future;

finalize finalize_proposal:
    input r0 as u64.public;
    input r1 as address.public;
    get proposals[r0] into r2;
    assert.eq r1 r2.creator;
    cast r2.id r2.creator r2.title_hash r2.created_block r2.duration_blocks true into r3 as ProposalData;
    set r3 into proposals[r0];

constructor:
    assert.eq program_owner aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl;
