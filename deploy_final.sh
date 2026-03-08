#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
export PRIVATE_KEY="APrivateKey1zkpEkWY9ESYkfkhtzba12fmkoutyJ2FuMKoCGx5hoevdQUX"
export ENDPOINT="https://api.provable.com/v2"

cd premium_voting_v6/premium_voting_v6
# Add the constructor explicitly back into the .aleo instructions to prevent constructor failure warning
sed -i '/constructor:/,+1d' build/main.aleo
echo -e "\nconstructor:\n    assert.eq edition 0u16;" >> build/main.aleo

leo deploy --network testnet --yes --broadcast --priority-fees 1000000
