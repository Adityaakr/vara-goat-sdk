# Vara Network + Vercel AI SDK Example

This example demonstrates how to build an AI-powered blockchain agent for the Vara Network using the GOAT SDK and Vercel AI SDK.

## Features

- 🤖 **AI-Powered Agent**: Natural language interface for blockchain operations
- 💰 **VARA Token Transfers**: Send VARA tokens using conversational commands
- 🔍 **Balance Queries**: Check wallet balances through AI
- 🌐 **Multi-Network Support**: Works with both Vara Mainnet and Testnet
- 🛠️ **Extensible**: Easy to add custom plugins and tools

## Prerequisites

- Node.js 18 or higher
- OpenAI API key
- Vara Network wallet mnemonic (12-word seed phrase)

## Installation

1. **Install dependencies:**
   ```bash
   pnpm install
   ```

2. **Set up environment variables:**
   ```bash
   cp .env.example .env
   ```

3. **Configure your `.env` file:**
   ```env
   # Required
   OPENAI_API_KEY=your_openai_api_key_here
   VARA_MNEMONIC=your twelve word mnemonic phrase goes here

   # Optional
   OPENAI_MODEL=gpt-4o-mini
   VARA_NETWORK=testnet  # or mainnet
   ```

## Usage

### Run the Interactive Agent

```bash
pnpm start
```

### Example Commands

Once the agent is running, try these natural language commands:

```
👤 You: What is my wallet address?
👤 You: Check my VARA balance
👤 You: Send 0.1 VARA to kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW
👤 You: What's the current network I'm connected to?
```

Type `exit` to quit the agent.

## Project Structure

```
vercel-ai/
├── index.ts           # Main application entry point
├── package.json       # Dependencies and scripts
├── tsconfig.json      # TypeScript configuration
├── .env.example       # Environment variables template
└── README.md          # This file
```

## How It Works

1. **Wallet Initialization**: The agent initializes a Vara Network wallet using your mnemonic
2. **Tool Registration**: GOAT SDK registers blockchain tools (like `sendVara`) with the AI
3. **AI Processing**: Vercel AI SDK processes your natural language requests
4. **Tool Execution**: The AI decides which blockchain tools to call based on your request
5. **Response**: Results are returned in natural language

## Available Tools

- **sendVara**: Send VARA tokens to another address
  - Parameters: `to` (recipient address), `amount` (VARA amount)
  - Example: "Send 1.5 VARA to kGkL..."

## Network Configuration

### Testnet (Default)
- RPC: `wss://testnet.vara.network`
- Explorer: https://testnet.vara.subscan.io
- Faucet: Get test tokens from [Vara Discord](https://discord.gg/vara-network)

### Mainnet
- RPC: `wss://rpc.vara.network`
- Explorer: https://vara.subscan.io
- Set `VARA_NETWORK=mainnet` in `.env`

## Security Notes

⚠️ **Important Security Considerations:**

- Never commit your `.env` file or expose your mnemonic
- Use testnet for development and testing
- Start with small amounts when testing on mainnet
- The AI has access to send transactions - review all operations carefully
- Consider implementing transaction limits for production use

## Extending the Example

### Add Custom Plugins

```typescript
import { myCustomPlugin } from "./plugins/myCustomPlugin";

const tools = await getOnChainTools({
    wallet: varaWallet,
    plugins: [
        sendVara(),
        myCustomPlugin(), // Add your custom plugin
    ],
});
```

### Use Different AI Models

Change the model in `index.ts`:

```typescript
const result = await generateText({
    model: openai("gpt-4o"),  // Use GPT-4 instead
    // ... rest of config
});
```

## Troubleshooting

### "Cannot find module" errors
Run `pnpm install` to install all dependencies.

### Connection errors
- Check your RPC URL in `.env`
- Verify network connectivity
- Try switching between mainnet/testnet

### Transaction failures
- Ensure sufficient VARA balance for transactions + fees
- Verify recipient address format
- Check network status on the explorer

## Resources

- [GOAT SDK Documentation](https://github.com/goat-sdk/goat)
- [Vara Network Documentation](https://vara.network/docs)
- [Vercel AI SDK Documentation](https://sdk.vercel.ai/docs)
- [Vara Network Explorer](https://vara.subscan.io)

## License

MIT
