import { z } from "zod";
import { VaraNetworkChain } from "../../../core/src/types/Chain.js";
import { sendVara, vara } from "./index.js";

// Schema for natural language commands
const sendCommandSchema = z.object({
    amount: z.number(),
    to: z.string(),
});

// VARA Mainnet chain definition
const VARA_MAINNET: VaraNetworkChain = {
    type: "substrate",
    id: "vara",
    name: "Vara Network",
    currency: { symbol: "VARA", decimals: 18 },
    rpcUrl: "wss://rpc.vara.network",
} as const;

// Parse natural language command
function parseSendCommand(command: string) {
    const match = command.match(/send\s+([\d.]+)\s+vara\s+to\s+([a-zA-Z0-9]+)/i);
    if (!match) {
        throw new Error('Invalid command format. Use: "send X VARA to address"');
    }

    return {
        amount: Number.parseFloat(match[1]),
        to: match[2],
    };
}

export async function sendVaraTokens(command: string, mnemonic: string) {
    try {
        // Parse the command
        const { amount, to } = parseSendCommand(command);

        // Validate the parsed data
        const validated = sendCommandSchema.parse({ amount, to });

        // Create wallet and connect
        const wallet = await vara(mnemonic, VARA_MAINNET);
        await wallet.init();

        // Get the send tool
        const plugin = sendVara();
        const tools = await plugin.getTools(wallet);
        const tool = tools[0];

        // Execute the transfer
        const result = await tool.execute({
            to: validated.to,
            amount: validated.amount,
        });

        // Disconnect
        await wallet.api.disconnect();

        return {
            success: true,
            hash: result.hash,
            message: `Successfully sent ${validated.amount} VARA to ${validated.to}`,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
}
