#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
export PRIVATE_KEY="APrivateKey1zkpEkWY9ESYkfkhtzba12fmkoutyJ2FuMKoCGx5hoevdQUX"
export ENDPOINT="https://api.explorer.provable.com/v1"
cd premium_voting_v6/premium_voting_v6 && leo deploy --network testnet --yes --broadcast
