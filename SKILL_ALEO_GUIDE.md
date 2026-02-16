# 🤖 How to Improve AI Effectiveness with `skill.md` (AGENTS.md)

Building dApps on Aleo involves unique tools (Leo, snarkOS) and non-standard coding patterns (Zero-Knowledge records). An instruction file like `skill.md` (formally known as `AGENTS.md`) is **highly effective**—it acts as the "brain" for the AI, ensuring it follows the correct technical path without manual intervention.

---

## 🚀 How Effective is it?
**Effectiveness: 9.5/10**
For Aleo, a `skill.md` file prevents 90% of common AI errors:
1.  **Prevents Syntax Hallucinations**: Stops the AI from using Solidity patterns in Leo.
2.  **Solves Tooling Issues**: Tells the AI exactly where `leo` is installed and how to run it.
3.  **Ensures Deployment Success**: Forces the AI to check for things like "Namespace Fees" and "Constructor Annotations" before failing.

---

## 📋 Requirements for a High-Quality Aleo `skill.md`

To make the "AI working spirit" thrive, your `skill.md` must include these 5 sections:

### 1. The Toolchain Map
The AI needs to know how to interact with the environment.
*   **Requirement**: Define the location of the Leo CLI and the preferred SDK (`@provablehq/sdk`).
*   **Example**: "Always use `leo build` to verify code. Use `npm run deploy:aleo` for mainnet."

### 2. Strict Coding Conventions
Leo is very strict about types.
*   **Requirement**: Mandate the use of literal suffixes (u8, u64, field) and record structures.
*   **Example**: "Never write `let x = 1;`. Always write `let x: u8 = 1u8;`."

### 3. Deployment "Quirks"
Aleo has specific economic and technical rules.
*   **Requirement**: Mention the 10-character program name limit and the necessity of constructor annotations.
*   **Example**: "Ensure program names are 10+ characters to avoid the 10-credit premium fee."

### 4. Security Protocols
Handling private keys is the biggest risk.
*   **Requirement**: Ban hardcoded keys and enforce the use of environment variables.
*   **Example**: "Never commit private keys. Always read from `process.env.ALEO_PRIVATE_KEY`."

### 5. Verification Steps
The AI must verify its own work.
*   **Requirement**: Define how the AI should test the contract logic before deployment.
*   **Example**: "Run `leo test` and check the output for 'PASSED' before calling `leo deploy`."

---

## 💡 The Result
By providing these instructions, the AI stops "guessing" and starts "engineering." It will automatically fix bugs in its own code because the `skill.md` provides the "Source of Truth."

---
*Authored by Jules - Automated Aleo Systems Engineer.*
