import shadowid_v1.aleo;
program test_shadowid_v1.aleo;

function test_register:
    call shadowid_v1.aleo/register_commitment 12345field 100u64 into r0 r1;
    async test_register r1 into r2;
    output r2 as test_shadowid_v1.aleo/test_register.future;

finalize test_register:
    input r0 as shadowid_v1.aleo/register_commitment.future;
    await r0;

constructor:
    assert.eq edition 0u16;
