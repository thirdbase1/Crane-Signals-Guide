import { Account, ProgramManager, NetworkRecordProvider, AleoNetworkClient, AleoKeyProvider } from "@aleohq/sdk";
import fs from "fs";
import path from "path";

async function deploy() {
    // Note: To deploy, you need a private key with sufficient Aleo credits.
    const privateKey = process.env.ALEO_PRIVATE_KEY;
    if (!privateKey) {
        console.error("Error: ALEO_PRIVATE_KEY environment variable is not set.");
        console.log("To use this script, please set your private key:");
        console.log("export ALEO_PRIVATE_KEY='your_private_key_here'");
        return;
    }

    try {
        const account = new Account({ privateKey });
        const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
        const keyProvider = new AleoKeyProvider();
        const recordProvider = new NetworkRecordProvider(account, networkClient);
        const programManager = new ProgramManager("https://api.explorer.provable.com/v1", keyProvider, recordProvider);
        programManager.setAccount(account);

        const programPath = path.join(process.cwd(), "aleo/build/main.aleo");
        if (!fs.existsSync(programPath)) {
            console.error(`Error: Program file not found at ${programPath}. Did you run 'leo build'?`);
            return;
        }

        const programCode = fs.readFileSync(programPath, "utf-8");

        console.log("Attempting to deploy 'crane_signals_cert.aleo'...");
        console.log("Account Address:", account.address().to_string());

        // Deployment fee (adjust as needed for current network state)
        const fee = 1.5;

        // Note: In a real environment, you would need to have credits in your account.
        // This call will fail if the account has 0 credits.
        const txId = await programManager.deploy(programCode, fee);

        console.log("Deployment successful!");
        console.log("Transaction ID:", txId);
        console.log("View on Explorer: https://explorer.provable.com/transaction/" + txId);
    } catch (e: any) {
        console.error("Deployment failed:", e.message || e);
        if (e.message && e.message.includes("does not exist")) {
            console.log("Hint: This usually means the account has no credits to pay for the deployment fee.");
        }
    }
}

deploy();
