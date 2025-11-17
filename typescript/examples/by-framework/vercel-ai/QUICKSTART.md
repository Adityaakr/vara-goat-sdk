# Quick Start Guide

Get up and running with the Vara AI Agent in 5 minutes!

## 1. Install Dependencies

From the project root:
```bash
cd typescript/examples/by-framework/vercel-ai
pnpm install
```

## 2. Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:
```env
OPENAI_API_KEY=sk-your-key-here
VARA_MNEMONIC=your twelve word mnemonic phrase
VARA_NETWORK=testnet
```

## 3. Run the Agent

```bash
pnpm start
```

## 4. Try It Out!

```
👤 You: What is my wallet address?
🤖 Assistant: Your wallet address is kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW

👤 You: Check my balance
🤖 Assistant: Your current balance is 10.5 VARA

👤 You: Send 0.1 VARA to kGkLEU3e3XXkJp2WK4eNpVmSab5xUNL9QtmLPh8QfCL2EgotW
🔧 Tool Results:
   sendVara: {
     "hash": "0x123..."
   }
🤖 Assistant: Successfully sent 0.1 VARA! Transaction hash: 0x123...
```

## Need Test Tokens?

For testnet, get free VARA tokens from:
- [Vara Discord Faucet](https://discord.gg/vara-network)
- Request in #faucet channel

## Common Issues

**"Insufficient balance"**: Get test tokens from the faucet
**"Connection failed"**: Check your RPC URL and network connectivity
**"Invalid mnemonic"**: Ensure your 12-word phrase is correct

## Next Steps

- Read the full [README.md](./README.md) for advanced features
- Explore the [Vara Network docs](https://vara.network/docs)
- Check out the [GOAT SDK](https://github.com/goat-sdk/goat)
