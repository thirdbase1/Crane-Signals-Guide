import { Account } from "@provablehq/sdk";

const privateKey = process.env.ALEO_PRIVATE_KEY || "APrivateKey1zkp4FKxqLzwxb4bVpoKFkv4Nb5sx3iD8BNf6BCU7f3Jc1tk";
const account = new Account({ privateKey });
console.log(account.address().to_string());
