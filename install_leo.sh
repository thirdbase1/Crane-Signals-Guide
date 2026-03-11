#!/bin/bash
export PATH="/home/jules/.cargo/bin:$PATH"
git clone https://github.com/AleoNet/leo.git
cd leo
git checkout v1.11.0 # use an older version that might compile
cargo install --path .
