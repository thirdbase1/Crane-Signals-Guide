#!/bin/bash

# bulk-execute.sh
# Usage: ./bulk-execute.sh <private_key> <address> <count>

PRIVATE_KEY=$1
ADDRESS=$2
COUNT=$3

if [ -z "$PRIVATE_KEY" ] || [ -z "$ADDRESS" ] || [ -z "$COUNT" ]; then
  echo "Usage: $0 <private_key> <address> <count>"
  exit 1
fi

BATCH_SIZE=10
NUM_BATCHES=$(( (COUNT + BATCH_SIZE - 1) / BATCH_SIZE ))

echo "Starting bulk execution of $COUNT transactions in $NUM_BATCHES batches..."

for (( b=0; b<NUM_BATCHES; b++ )); do
  echo "Processing batch $((b+1)) of $NUM_BATCHES..."
  for (( i=0; i<BATCH_SIZE; i++ )); do
    idx=$(( b * BATCH_SIZE + i + 1 ))
    if [ $idx -gt $COUNT ]; then break; fi

    echo "Launching execution #$idx..."
    (
      cd aleo && leo execute issue_certification "$ADDRESS" "${idx}u8" \
        --private-key "$PRIVATE_KEY" \
        --network testnet \
        --endpoint https://api.explorer.provable.com/v1 \
        --yes --broadcast > /dev/null 2>&1
    ) &
  done
  wait
  echo "Batch $((b+1)) completed."
done

echo "Bulk execution finished."
