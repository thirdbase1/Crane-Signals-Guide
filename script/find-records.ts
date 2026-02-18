import { Account, AleoNetworkClient, NetworkRecordProvider } from "@provablehq/sdk";

async function findRecords() {
    const privateKey = "APrivateKey1zkpDbjq2UpmcACsQXP8QRC2WNfL2B29hzCF8NSHhzr5UyHq";
    const account = new Account({ privateKey });
    const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
    const recordProvider = new NetworkRecordProvider(account, networkClient);

    console.log("Scanning for credits.aleo records...");
    try {
        const records = await recordProvider.findCreditsRecords(0);
        console.log("Found records:", JSON.stringify(records, null, 2));
    } catch (e: any) {
        console.log("Error:", e.message);
    }
}

findRecords();
