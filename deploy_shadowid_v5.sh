#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"

export PRIVATE_KEY="${ALEO_PRIVATE_KEY}"
export ENDPOINT="https://api.provable.com/v2"

cd shadowid_v5
leo deploy --network testnet --yes --broadcast --priority-fees 1000000
