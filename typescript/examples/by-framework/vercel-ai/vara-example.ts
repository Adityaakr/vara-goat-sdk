import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { vara } from "@goat-sdk/wallet-vara";
import * as bip39 from "bip39";

// Example usage of Vara wallet
async function main() {
    try {
        // Initialize Vara wallet
        const mnemonic = process.env.VARA_MNEMONIC || "your mnemonic here";
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        
        const tools = await getOnChainTools({
            wallet: vara({
                seed,
                chain: "mainnet", // or "testnet"
            }),
        });

        console.log("✅ Vara wallet initialized successfully!");
        console.log("Available tools:", tools.map(tool => tool.name));
        
    } catch (error) {
        console.error("❌ Error initializing Vara wallet:", error);
    }
}

if (require.main === module) {
    main();
} 