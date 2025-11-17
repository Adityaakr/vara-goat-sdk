import readline from "node:readline";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { getOnChainTools } from "@goat-sdk/adapter-vercel-ai";
import { vara } from "@goat-sdk/wallet-vara";
import { sendVara } from "@goat-sdk/wallet-vara";
import * as bip39 from "bip39";

require("dotenv").config();

// Vara Network configuration
const VARA_MAINNET = {
    type: "substrate" as const,
    id: "vara" as const,
    name: "Vara Network",
    currency: { symbol: "VARA", decimals: 12 },
    rpcUrl: process.env.VARA_RPC_URL || "wss://rpc.vara.network",
    explorer: "https://vara.subscan.io",
};

const VARA_TESTNET = {
    type: "substrate" as const,
    id: "vara-testnet" as const,
    name: "Vara Testnet",
    currency: { symbol: "TVARA", decimals: 12 },
    rpcUrl: process.env.VARA_RPC_URL || "wss://testnet.vara.network",
    explorer: "https://testnet.vara.subscan.io",
};

async function main() {
    try {
        // 1. Initialize Vara wallet from mnemonic
        const mnemonic = process.env.VARA_MNEMONIC;
        if (!mnemonic) {
            throw new Error("VARA_MNEMONIC environment variable is required");
        }

        console.log("🔐 Initializing Vara wallet...");
        const seed = bip39.mnemonicToSeedSync(mnemonic);
        
        // Choose network (mainnet or testnet)
        const network = process.env.VARA_NETWORK === "mainnet" ? VARA_MAINNET : VARA_TESTNET;
        console.log(`🌐 Connecting to ${network.name}...`);

        const varaWallet = await vara(seed.toString("hex"), network);
        
        console.log(`✅ Wallet initialized!`);
        console.log(`📍 Address: ${varaWallet.getAddress()}`);
        
        // Get balance
        const balance = await varaWallet.balanceOf(varaWallet.getAddress());
        console.log(`💰 Balance: ${Number(balance.value) / 10 ** balance.decimals} ${balance.symbol}\n`);

        // 2. Get onchain tools with Vara plugins
        const tools = await getOnChainTools({
            wallet: varaWallet,
            plugins: [
                sendVara(), // Enable VARA token transfers
            ],
        });

        console.log("🛠️  Available tools:");
        tools.forEach((tool: any) => {
            console.log(`   - ${tool.name}: ${tool.description}`);
        });
        console.log("\n");

        // 3. Create interactive CLI
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log("🤖 Vara AI Agent Ready!");
        console.log("💡 Try commands like:");
        console.log('   - "What is my wallet address?"');
        console.log('   - "Check my VARA balance"');
        console.log('   - "Send 0.1 VARA to kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW"');
        console.log('   - Type "exit" to quit\n');

        while (true) {
            const prompt = await new Promise<string>((resolve) => {
                rl.question("👤 You: ", resolve);
            });

            if (prompt.toLowerCase() === "exit") {
                console.log("\n👋 Disconnecting from Vara Network...");
                await varaWallet.api.disconnect();
                rl.close();
                break;
            }

            if (!prompt.trim()) {
                continue;
            }

            console.log("\n🤔 Processing...\n");

            try {
                const result = await generateText({
                    model: openai(process.env.OPENAI_MODEL || "gpt-4o-mini"),
                    tools: tools,
                    maxSteps: 10,
                    prompt: `You are a helpful AI assistant for the Vara Network blockchain. 
                    
Current wallet context:
- Address: ${varaWallet.getAddress()}
- Network: ${network.name}
- Balance: ${Number(balance.value) / 10 ** balance.decimals} ${balance.symbol}

User request: ${prompt}

When sending VARA tokens, always confirm the transaction details before executing.`,
                    onStepFinish: (event: any) => {
                        if (event.toolResults && event.toolResults.length > 0) {
                            console.log("🔧 Tool Results:");
                            event.toolResults.forEach((toolResult: any) => {
                                console.log(`   ${toolResult.toolName}:`, JSON.stringify(toolResult.result, null, 2));
                            });
                            console.log("");
                        }
                    },
                });

                console.log("🤖 Assistant:", result.text);
                console.log("\n" + "─".repeat(50) + "\n");
            } catch (error) {
                console.error("❌ Error:", error instanceof Error ? error.message : error);
                console.log("\n" + "─".repeat(50) + "\n");
            }
        }
    } catch (error) {
        console.error("❌ Fatal error:", error);
        process.exit(1);
    }
}

// Run the example
if (require.main === module) {
    main().catch(console.error);
}
