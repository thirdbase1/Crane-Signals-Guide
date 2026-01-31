# 🤖 Aleo AI Mobile IDE: Issue Identification & Technical Fixes

This README addresses the primary "deployment killers" encountered while building the **AI-Powered Mobile IDE for Aleo**. Below are the identified issues and their recommended technical solutions to ensure a seamless "Vibe Coding" experience.

---

## 1. 🛠 The 'Worker' Crash (SharedArrayBuffer)

### The Issue
**Error**: `Failed to execute 'postMessage' on 'Worker': SharedArrayBuffer transfer requires self.crossOriginIsolated.`

**Cause**: The Aleo SDK uses multithreaded WebAssembly (WASM) to generate Zero-Knowledge Proofs (ZKP) efficiently. This requires `SharedArrayBuffer`, which modern browsers restrict for security (Spectre/Meltdown prevention). It only works if the environment is **Cross-Origin Isolated**, requiring two specific HTTP headers:
1.  `Cross-Origin-Opener-Policy: same-origin`
2.  `Cross-Origin-Embedder-Policy: require-corp`

On mobile devices or AI-preview environments, you often cannot configure the underlying server to emit these headers.

### The Fix: Service Worker Polyfill
The most robust way to solve this in a Next.js/Mobile environment without server-level access is using a **Service Worker** to intercept requests and inject the necessary headers.

#### Implementation:
1.  **Install the Library**:
    ```bash
    npm install coi-serviceworker
    ```
2.  **Add to Your Entry Point**:
    In your `_app.tsx` or `layout.tsx`, import the library. It will automatically detect if headers are missing and reload the page with a registered service worker that injects them.
    ```typescript
    if (typeof window !== 'undefined') {
      import('coi-serviceworker');
    }
    ```
3.  **Alternative (Manual)**:
    If you don't want a dependency, place a `coi-serviceworker.js` file in your `/public` folder and include it in your `<head>`:
    ```html
    <script src="/coi-serviceworker.js"></script>
    ```

**Result**: Your mobile browser (Safari/Chrome) will now support `SharedArrayBuffer`, and the Aleo prover will initialize without crashing.

---

## 2. 💸 The 'Namespace' Cost Trap

### The Issue
**Problem**: Short program names (e.g., `hello.aleo`) trigger a massive **Namespace Fee**.

**Aleo Fee Structure**:
*   **< 10 Characters**: Incurs a premium namespace fee (often 10-100+ credits).
*   **>= 10 Characters**: 0 credit namespace fee.

Beginners using AI usually prompt for simple names like `token` or `vault`, leading to deployment failures because the user's testnet wallet doesn't have enough credits to pay for the "premium name."

### The Fix: Automated Name Expansion
Implement a silent "Sanity Check" utility that ensures the program name is always 10+ characters and unique before it ever reaches the compilation stage.

#### Implementation:
Create a utility function to process the AI-generated name:

```typescript
/**
 * Ensures Aleo program names are long enough to be free (>=10 chars)
 * and unique enough to avoid collisions.
 */
export function optimizeProgramName(aiGeneratedName: string): string {
  // 1. Sanitize (Aleo only allows a-z, 0-9, and _)
  let baseName = aiGeneratedName
    .toLowerCase()
    .replace(".aleo", "")
    .replace(/[^a-z0-9_]/g, "_");

  // 2. Expand if too short (The "Free Tier" logic)
  if (baseName.length < 10) {
    const suffix = "_vibe_coding";
    baseName = (baseName + suffix).substring(0, 20); // Keep it reasonable
  }

  // 3. Add Uniqueness (Optional but recommended for a shared IDE)
  const uniqueId = Math.random().toString(36).substring(2, 6);

  return `${baseName}_${uniqueId}.aleo`;
}
```

#### Why this works for Vibe Coding:
*   **User Stays Happy**: The deployment fee stays at ~3 credits (standard), which is easily covered by faucets.
*   **Zero friction**: The user sees "Deploying hello..." but the engine actually deploys `hello_vibe_coding_a9b1.aleo`.
*   **No Collisions**: Since Aleo program IDs must be globally unique, the random suffix prevents "Program already exists" errors.

---

## 🌟 Best Practices for AI-Generated Leo
To ensure the AI writes "accurate" Leo without mistakes:
1.  **Strict Literal Suffixes**: Prompt the AI to *always* append type suffixes (e.g., `1u8` instead of `1`).
2.  **Explicit Imports**: Ensure the AI always imports the necessary types if referencing other programs.
3.  **Modern Constructor**: Use the `@noupgrade async constructor() {}` pattern to satisfy modern Leo compiler requirements for testnet deployment.

---

*This issue identification and fix guide was prepared to support the development of the Aleo Mobile IDE.*
