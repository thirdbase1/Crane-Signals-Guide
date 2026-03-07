#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
# Set ALEO_PRIVATE_KEY in your environment
snarkos developer deploy "premium_voting_v6_private.aleo" --private-key "${ALEO_PRIVATE_KEY}" --query "https://api.explorer.provable.com/v1" --priority-fee 0 --record "$(snarkos developer execute credits.aleo split "YOUR_RECORD_HERE" 5000000u64 --private-key "${ALEO_PRIVATE_KEY}" --query "https://api.explorer.provable.com/v1" --broadcast "https://api.explorer.provable.com/v1/testnet/transaction/broadcast" | jq -r .)" --broadcast "https://api.explorer.provable.com/v1/testnet/transaction/broadcast"
