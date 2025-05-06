import readline from "node:readline";
import { openai } from "@ai-sdk/openai";
import { generateText, tool } from "ai";
import { vara } from "../../../packages/wallets/vara/src/index.ts";
import { VaraNetworkChain } from "../../../packages/core/src/types/Chain.ts";
import { z } from "zod";
import 'dotenv/config';

const VARA_MAINNET: VaraNetworkChain = {
    type: "substrate",
    id: "vara",
    name: "Vara Network",
    currency: { symbol: "VARA", decimals: 18 },
    rpcUrl: "wss://rpc.vara.network",
} as const;

// Convert smallest unit to human readable VARA
const toHumanReadable = (amount: string): string => {
    const vara = BigInt(amount) / BigInt(10 ** 12);
    const decimals = (BigInt(amount) % BigInt(10 ** 12)).toString().padStart(12, '0');
    return `${vara}.${decimals}`;
};

// Convert human readable to smallest unit
const toSmallestUnit = (amount: string | number): string => {
    const parsedAmount = Number.parseFloat(amount.toString());
    return (parsedAmount * 10 ** 12).toString();
};

async function main() {
    try {
        // For testing only - in production, get this from environment variables
        const mnemonic = process.env.VARA_MNEMONIC || 
            "test test test test test test test test test test test junk";
        
        const wallet = await vara(mnemonic, VARA_MAINNET);
        await wallet.init();
        console.log('Connected to Vara network');
        console.log('Wallet address:', await wallet.getAddress());

        // Create a function that will be used to handle the VARA transfers
        async function handleVaraTransfer(to: string, amount: string) {
            try {
                console.log(`Sending ${amount} VARA tokens to ${to}`);
                const amountInSmallestUnit = toSmallestUnit(amount);
                const tx = wallet.api.tx.balances.transferKeepAlive(
                    to,
                    amountInSmallestUnit
                );
                const hash = await wallet.signAndSend(tx);
                return { 
                    success: true, 
                    hash,
                    message: `Successfully sent ${amount} VARA tokens to ${to}. Transaction hash: ${hash}` 
                };
            } catch (error) {
                console.error("Error sending VARA:", error);
                return { 
                    success: false, 
                    error: String(error) 
                };
            }
        }

        // Function to check wallet balance
        async function checkWalletBalance(address?: string) {
            try {
                const targetAddress = address || await wallet.getAddress();
                const { data: balance } = await wallet.api.query.system.account(targetAddress);
                const freeBalance = balance.free.toString();
                const readableBalance = toHumanReadable(freeBalance);
                
                return {
                    success: true,
                    address: targetAddress,
                    balanceRaw: freeBalance,
                    balance: readableBalance,
                    message: `Wallet ${targetAddress} has a balance of ${readableBalance} VARA`
                };
            } catch (error) {
                console.error("Error checking wallet balance:", error);
                return {
                    success: false,
                    error: String(error)
                };
            }
        }

        // 3. Create readline interface for interaction
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        while (true) {
            const prompt = await new Promise<string>((resolve) => {
                rl.question('Enter your prompt (or "exit" to quit): ', resolve);
            });

            if (prompt === "exit") {
                rl.close();
                break;
            }

            console.log("\n-------------------\n");
            console.log("TOOLS CALLED");
            console.log("\n-------------------\n");

            try {
                const result = await generateText({
                    model: openai("gpt-4o-mini"),
                    tools: {
                        sendVara: tool({
                            description: "Send VARA tokens to another address. The amount should be in whole VARA tokens (e.g., '1' means 1 VARA token, '0.5' means half a VARA token)",
                            parameters: z.object({
                                to: z.string().describe("Recipient address"),
                                amount: z.string().describe("Amount of VARA tokens to send (e.g., '1' for 1 VARA token)")
                            }),
                            execute: async ({ to, amount }) => {
                                return await handleVaraTransfer(to, amount);
                            }
                        }),
                        checkBalance: tool({
                            description: "Check the VARA token balance of a wallet address. If no address is provided, it checks the balance of the current wallet.",
                            parameters: z.object({
                                address: z.string().optional().describe("Optional wallet address to check. If not provided, checks the current wallet's balance.")
                            }),
                            execute: async ({ address }) => {
                                return await checkWalletBalance(address);
                            }
                        })
                    },
                    maxSteps: 10,
                    prompt: prompt,
                    onStepFinish: (event) => {
                        console.log(event.toolResults);
                    },
                });

                console.log("\n-------------------\n");
                console.log("RESPONSE");
                console.log("\n-------------------\n");
                console.log(result.text);
            } catch (error) {
                console.error(error);
            }
            console.log("\n-------------------\n");
        }

        // Disconnect wallet
        await wallet.api.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 
