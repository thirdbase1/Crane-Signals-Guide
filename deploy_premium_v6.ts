import { Account, ProgramManager, NetworkRecordProvider, AleoNetworkClient, AleoKeyProvider } from "@provablehq/sdk";
import fs from "fs";
import path from "path";

async function main() {
    console.log("Starting Aleo deployment script...");

    // Using the private key from environment variables
    const privateKey = process.env.ALEO_PRIVATE_KEY;

    // Validate private key
    if (!privateKey) {
        console.error("Error: ALEO_PRIVATE_KEY environment variable is not set.");
        process.exit(1);
    }

    try {
        // Initialize Aleo services
        const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
        const keyProvider = new AleoKeyProvider();
        const recordProvider = new NetworkRecordProvider(new Account({ privateKey }), networkClient);

        // Initialize Program Manager
        const programManager = new ProgramManager(
            "https://api.explorer.provable.com/v1",
            keyProvider,
            recordProvider
        );

        // Set the account and network parameters
        const account = new Account({ privateKey });
        console.log(`Using account address: ${account.address().to_string()}`);
        programManager.setAccount(account);

        // Define program content based on compiled output
        const programPath = path.join(process.cwd(), "premium_voting_v6/premium_voting_v6/build/main.aleo");
        if (!fs.existsSync(programPath)) {
            console.error(`Error: Program file not found at ${programPath}.`);
            process.exit(1);
        }
        const programContent = fs.readFileSync(programPath, "utf-8");

        console.log("Compiling and deploying 'premium_voting_v6.aleo'...");

        // Fee for deployment
        const deployFee = 4.0;

        console.log(`Setting deployment fee to ${deployFee} credits...`);

        // Deploy the program
        const txId = await programManager.deploy(programContent, deployFee, false, "");
        console.log(`\n✅ Program deployed successfully!`);
        console.log(`✅ Transaction ID: ${txId}`);
        console.log(`✅ Program Name: premium_voting_v6.aleo`);

    } catch (error) {
        console.error("Deployment failed:", error);
    }
}

main();
