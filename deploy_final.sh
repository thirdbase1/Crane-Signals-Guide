#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
export PRIVATE_KEY="APrivateKey1zkpEkWY9ESYkfkhtzba12fmkoutyJ2FuMKoCGx5hoevdQUX"
export ENDPOINT="https://api.explorer.provable.com/v1"

cd premium_voting_v6/premium_voting_v6
# Ensure constructor is written properly to suppress compilation warnings
sed -i '/constructor:/,+1d' build/main.aleo
echo -e "\nconstructor:\n    assert.eq edition 0u16;" >> build/main.aleo

leo deploy --network testnet --yes --broadcast --priority-fees 1000000
