#!/bin/bash

# worker-bulk.sh
# Usage: ./worker-bulk.sh <private_key> <address> <count_per_worker>

PRIVATE_KEY=$1
ADDRESS=$2
COUNT=$3

if [ -z "$PRIVATE_KEY" ] || [ -z "$ADDRESS" ] || [ -z "$COUNT" ]; then
  echo "Usage: $0 <private_key> <address> <count_per_worker>"
  exit 1
fi

echo "Starting 10 workers, each doing $COUNT transactions..."

for w in {1..10}; do
  (
    echo "Worker $w starting..."
    mkdir -p "worker_$w"
    cp -r aleo/* "worker_$w/"
    cd "worker_$w"
    for (( i=0; i<COUNT; i++ )); do
      leo execute issue_certification "$ADDRESS" "${i}u8" \
          --private-key "$PRIVATE_KEY" \
          --network testnet \
          --endpoint https://api.explorer.provable.com/v1 \
          --yes --broadcast > /dev/null 2>&1
      echo "Worker $w completed execution $((i+1))/$COUNT"
    done
    echo "Worker $w finished."
  ) &
done

wait
rm -rf worker_*
echo "All workers finished and cleaned up."
