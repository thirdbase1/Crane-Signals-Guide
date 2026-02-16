# AGENTS.md - Aleo Development Protocol

This file provides the AI agent with the "Source of Truth" for Aleo blockchain development. Follow these rules to ensure zero-error integration.

## 🛠 Tooling & Environment
- **Leo CLI**: Must be v3.4.0+. Primary commands are `leo build`, `leo test`, and `leo deploy`.
- **SDK**: Use `@provablehq/sdk` for all TypeScript/Node.js interactions.
- **Node**: Ensure `tsx` is used to run scripts for native module support.

## ✍️ Leo Coding Standards (MANDATORY)
1. **Type Suffixes**: Never omit type suffixes.
   - ✅ `let count: u32 = 0u32;`
   - ❌ `let count = 0;`
2. **Records**: All records MUST have an `owner: address` field.
3. **Mappings**:
   - Updates (`Mapping::set`) and Reads (`Mapping::get`) MUST occur inside `async function` (finalize) blocks.
   - Use `Future` return types in `async transition` to link to finalize blocks.
4. **Constructors**: Always include `@noupgrade async constructor() {}` or `@admin(address="...")` for mutability control.

## 🚀 Deployment Rules
1. **Program Naming**: Force program names to be **10 characters or longer** (excluding `.aleo`) to avoid the 10-credit premium namespace fee.
2. **Credit Check**: Before deploying, verify account balance via `leo execute` or `leo query account`.
3. **Network**: Default to `testnet` and endpoint `https://api.explorer.provable.com/v1`.

## 🛡 Security Rules
1. **Private Keys**: NEVER hardcode private keys. Use `process.env.ALEO_PRIVATE_KEY`.
2. **Secrets**: If a user provides a key in chat, use it for the task then ensure it is NOT committed to the repo.

## ✅ Verification Protocol
1. After writing Leo code, always run `leo build`.
2. Always write and run a test in `tests/*.leo` using `leo test` before attempting a network deployment.
3. Verify deployments via `leo query program <NAME> --network testnet`.

---
*Follow this protocol to ensure perfect Aleo integration.*
