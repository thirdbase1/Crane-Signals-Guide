import {
    Account,
    ProgramManager,
    AleoKeyProvider,
    NetworkRecordProvider,
    AleoNetworkClient,
    initThreadPool
} from "@provablehq/sdk";
import express, { Request, Response } from "express";

const app = express();
app.use(express.json());

// Initialize thread pool for stability in restricted/server environments
(async () => {
    await initThreadPool(1);
})();

app.post("/compile-deploy", async (req: Request, res: Response) => {
    const { leoCode, fee } = req.body;

    if (!leoCode || typeof fee !== "number") {
        return res.status(400).json({ error: "Missing leoCode or fee" });
    }

    try {
        // 1. Setup providers with a dummy account (required for synthesis but not used for signing)
        const networkClient = new AleoNetworkClient("https://api.explorer.provable.com/v1");
        const keyProvider = new AleoKeyProvider();

        // Use a dummy private key for synthesis.
        // Important: This account will NOT be the one signing the final transaction.
        const dummyAccount = new Account();
        const recordProvider = new NetworkRecordProvider(dummyAccount, networkClient);

        const programManager = new ProgramManager(
            "https://api.explorer.provable.com/v1",
            keyProvider,
            recordProvider
        );
        programManager.setAccount(dummyAccount);

        console.log("Synthesizing program and building unsigned transaction...");

        // 2. Build the deployment transaction
        // This generates the proving/verifying keys and the synthesis without signing.
        const unsignedTx = await programManager.buildDeploymentTransaction(
            leoCode,
            fee,
            false // private fee set to false (public fee)
        );

        // 3. Return the unsigned transaction object (as a string or JSON)
        // The frontend will take this and use the wallet adapter to sign/broadcast.
        res.json({ unsignedTransaction: unsignedTx.toString() });
    } catch (error: any) {
        console.error("Proving error:", error);
        res.status(500).json({ error: error.message || "Internal server error during proving" });
    }
});

app.get("/health", (req, res) => {
    res.json({ status: "healthy", timestamp: new Date().toISOString() });
});

const PORT = process.env.PROVER_PORT || 3001;
app.listen(PORT, () => {
    console.log(`Aleo Remote Proving API running on port ${PORT}`);
});
