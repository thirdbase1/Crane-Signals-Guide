import credits.aleo;
program premium_voting_v1.aleo;

record PremiumDAO:
    owner as address.private;
    name as field.private;
    token_address as address.private;
    subscription_fee as u64.private;
    active as boolean.private;

record VoteRecord:
    owner as address.private;
    proposal_id as field.private;
    voter as address.private;
    vote_hash as field.private;
    vote_nonce as field.private;
    vote_index as u8.private;

record DaoSubscription:
    owner as address.private;
    dao_address as address.private;
    subscriber as address.private;
    duration_blocks as u32.private;
    active as boolean.private;

function create_premium_dao:
    input r0 as field.public;
    input r1 as address.public;
    input r2 as u64.public;
    input r3 as credits.aleo/credits.record;
    input r4 as u64.public;
    gte r4 5000000u64 into r5;
    assert.eq r5 true;
    call credits.aleo/transfer_private r3 aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl r4 into r6 r7;
    cast self.caller r0 r1 r2 true into r8 as PremiumDAO.record;
    async create_premium_dao into r9;
    output r8 as PremiumDAO.record;
    output r6 as credits.aleo/credits.record;
    output r7 as credits.aleo/credits.record;
    output r9 as premium_voting_v1.aleo/create_premium_dao.future;

finalize create_premium_dao:
    assert.eq true true;

function subscribe_to_dao:
    input r0 as PremiumDAO.record;
    input r1 as u64.public;
    input r2 as credits.aleo/credits.record;
    gt r1 10u64 into r3;
    sub r1 10u64 into r4;
    mul r4 r0.subscription_fee into r5;
    ternary r3 r5 0u64 into r6;
    call credits.aleo/transfer_private r2 r0.owner r6 into r7 r8;
    cast self.caller r0.owner self.caller 100800u32 true into r9 as DaoSubscription.record;
    async subscribe_to_dao into r10;
    output r9 as DaoSubscription.record;
    output r7 as credits.aleo/credits.record;
    output r8 as credits.aleo/credits.record;
    output r10 as premium_voting_v1.aleo/subscribe_to_dao.future;

finalize subscribe_to_dao:
    assert.eq true true;

function cast_vote:
    input r0 as field.public;
    input r1 as field.public;
    input r2 as field.public;
    input r3 as u8.public;
    cast self.caller r0 self.caller r1 r2 r3 into r4 as VoteRecord.record;
    output r4 as VoteRecord.record;

function verify_vote:
    input r0 as field.public;
    input r1 as field.public;
    is.eq r0 r1 into r2;
    output r2 as boolean.private;

constructor:
    assert.eq program_owner aleo1676v0q6rc2l3g7xy49p7243rlghvqle5ykswa8e2s9u7c24xxvzst4ufkl;
