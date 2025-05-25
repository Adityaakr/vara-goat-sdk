import { Chain, PluginBase, type ToolBase, WalletClientBase } from "@goat-sdk/core";
import { z } from "zod";
import { VaraKeyringWalletClient } from "./VaraWalletClient";

const toSmallestUnit = (amount: string | number): string => {
    const parsedAmount = Number.parseFloat(amount.toString());
    return (parsedAmount * 10 ** 12).toString();
};

// Define a Zod schema for parameters
const sendVaraParametersSchema = z.object({
    to: z.string().min(1, "Recipient address is required"),
    amount: z.union([z.number(), z.string()]).transform((val) => val.toString()),
});

export type SendVaraParameters = z.infer<typeof sendVaraParametersSchema>;
export type SendVaraResult = { hash: string };

export class SendVaraPlugin extends PluginBase<WalletClientBase> {
    constructor() {
        super("sendVara", []);
    }

    supportsChain(chain: Chain): boolean {
        return chain.type === "substrate";
    }

    async getTools(wallet: WalletClientBase): Promise<ToolBase[]> {
        const varaWallet = wallet as VaraKeyringWalletClient;
        return [
            {
                name: "sendVara",
                description: "Send VARA tokens to another address",
                parameters: sendVaraParametersSchema,
                execute: async (parameters: SendVaraParameters) => {
                    try {
                        const amount = toSmallestUnit(parameters.amount);
                        // Create the transaction directly using the Gear API
                        const tx = varaWallet.api.tx.balances.transferKeepAlive(parameters.to, amount);
                        // Sign and send the transaction
                        const hash = await varaWallet.signAndSend(tx);
                        return { hash };
                    } catch (error) {
                        console.error("Error in sendVara:", error);
                        throw error;
                    }
                },
            } as unknown as ToolBase,
        ];
    }
}

/** factory:  plugins:[ sendVara() ] */
export const sendVara = () => new SendVaraPlugin();
