import { z } from "zod";
import { VaraWalletClient } from "./types";

// Schema for natural language commands
const sendCommandSchema = z.object({
    amount: z.number(),
    to: z.string(),
});

// Parse natural language command
export function parseSendCommand(command: string) {
    const match = command.match(/send\s+([\d.]+)\s+vara\s+to\s+([a-zA-Z0-9]+)/i);
    if (!match) {
        throw new Error('Invalid command format. Use: "send X VARA to address"');
    }

    return {
        amount: Number.parseFloat(match[1]),
        to: match[2],
    };
}

export async function executeCommand(command: string, wallet: VaraWalletClient) {
    try {
        // Parse the command
        const { amount, to } = parseSendCommand(command);

        // Validate the parsed data
        const validated = sendCommandSchema.parse({ amount, to });

        // Execute the transfer
        const result = await wallet.sendVara(validated.to, validated.amount);

        return {
            success: true,
            hash: result.hash,
            message: result.message,
        };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error occurred",
        };
    }
} 