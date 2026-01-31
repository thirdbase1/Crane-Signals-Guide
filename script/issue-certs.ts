import { Account, ProgramManager, NetworkRecordProvider, AleoNetworkClient, AleoKeyProvider } from "@aleohq/sdk";

async function issueCerts() {
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

        const programId = "crane_signals_cert.aleo";
        const receiver = account.address().to_string();
        const fee = 0.5; // Execution fee

        console.log(`Starting to issue 10 certifications to ${receiver}...`);

        for (let i = 1; i <= 10; i++) {
            console.log(`Issuing certification #${i} (Signal Type: ${i})...`);
            try {
                const txId = await programManager.execute(
                    programId,
                    "issue_certification",
                    fee,
                    false, // Use private fee (false means public)
                    [receiver, `${i}u8`]
                );
                console.log(`Certification #${i} issued! Transaction ID: ${txId}`);
                console.log(`View: https://explorer.provable.com/transaction/${txId}`);
            } catch (innerError: any) {
                console.error(`Failed to issue certification #${i}:`, innerError.message || innerError);
            }
        }
    } catch (e: any) {
        console.error("Execution failed:", e.message || e);
    }
}

issueCerts();
