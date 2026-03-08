#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
export ALEO_PRIVATE_KEY="APrivateKey1zkpEkWY9ESYkfkhtzba12fmkoutyJ2FuMKoCGx5hoevdQUX"
cd premium_voting_v6/premium_voting_v6
snarkos developer deploy "premium_voting_v6.aleo" --private-key "${ALEO_PRIVATE_KEY}" --query "https://api.explorer.provable.com/v1" --priority-fee 0 --broadcast "https://api.explorer.provable.com/v1/testnet/transaction/broadcast"
