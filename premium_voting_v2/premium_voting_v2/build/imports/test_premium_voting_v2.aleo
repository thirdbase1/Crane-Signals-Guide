import credits.aleo;
import premium_voting_v2_jules.aleo;
program test_premium_voting_v2.aleo;

function test_create_proposal:
    call premium_voting_v2_jules.aleo/create_proposal_for_dao 1u64 12345field 100u64 into r0;
