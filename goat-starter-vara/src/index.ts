import { VaraWalletClient, VaraChainType } from './types';
import { executeCommand } from './commands';
import readline from 'node:readline';
import 'dotenv/config';

const VARA_MAINNET: VaraChainType = {
    type: "substrate",
    id: "vara",
    name: "Vara Network",
    currency: { symbol: "VARA", decimals: 18 },
    rpcUrl: "wss://rpc.vara.network"
} as const;

async function main() {
    try {
        // Get mnemonic from environment variable or use test mnemonic
        const mnemonic = process.env.VARA_MNEMONIC || 
            "test test test test test test test test test test test junk";

        // Initialize wallet
        const wallet = new VaraWalletClient(mnemonic, VARA_MAINNET);
        await wallet.init();

        // Get wallet address
        const address = wallet.getAddress();
        console.log('Wallet address:', address);

        // Get wallet balance
        const balance = await wallet.getBalance();
        console.log('Wallet balance:', balance, 'VARA');

        // Create readline interface for interaction
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout,
        });

        console.log('\nEnter commands in the format: "send X VARA to address"');
        console.log('Type "exit" to quit\n');

        while (true) {
            const command = await new Promise<string>((resolve) => {
                rl.question('Enter command: ', resolve);
            });

            if (command.toLowerCase() === 'exit') {
                rl.close();
                break;
            }

            try {
                const result = await executeCommand(command, wallet);
                if (result.success) {
                    console.log('\n✅', result.message);
                } else {
                    console.log('\n❌ Error:', result.error);
                }
            } catch (error) {
                console.log('\n❌ Error:', error instanceof Error ? error.message : 'Unknown error occurred');
            }

            // Show updated balance
            const newBalance = await wallet.getBalance();
            console.log('Current balance:', newBalance, 'VARA\n');
        }

        // Disconnect wallet
        await wallet.disconnect();
    } catch (error) {
        console.error('Error:', error);
    }
}

main(); 