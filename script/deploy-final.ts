import { Account, ProgramManager, NetworkRecordProvider, AleoNetworkClient, AleoKeyProvider } from "@provablehq/sdk";
import fs from "fs";
import path from "path";

async function deploy(programFolder: string, fee: number) {
    const privateKey = process.env.ALEO_PRIVATE_KEY;
    if (!privateKey) {
        console.error("Error: ALEO_PRIVATE_KEY environment variable is not set.");
        return;
    }

    try {
        const account = new Account({ privateKey });
        const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
        const keyProvider = new AleoKeyProvider();
        const recordProvider = new NetworkRecordProvider(account, networkClient);
        const programManager = new ProgramManager("https://api.explorer.provable.com/v1", keyProvider, recordProvider);
        programManager.setAccount(account);

        const programPath = path.join(process.cwd(), programFolder, "build/main.aleo");
        if (!fs.existsSync(programPath)) {
            console.error(`Error: Program file not found at ${programPath}. Run 'leo build' first.`);
            return;
        }

        const programCode = fs.readFileSync(programPath, "utf-8");
        const programName = programCode.match(/program\s+([\w.]+);/)?.[1] || programFolder;

        console.log(`Deploying ${programName}...`);
        const txId = await programManager.deploy(programCode, fee);

        console.log(`Success! Transaction ID: ${txId}`);
        console.log(`View: https://explorer.provable.com/transaction/${txId}`);
    } catch (e: any) {
        console.error(`Deployment of ${programFolder} failed:`, e.message || e);
    }
}

async function run() {
    // Deploy freemium_voting_v1.aleo
    await deploy("aleo_voting_final", 2.0);
    // Deploy premium_voting_v2.aleo
    await deploy("aleo_premium_voting", 2.0);
}

run();
